"""Run from the repository root: python tools/validate_site.py (standard library only)."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://newnanchiro.com'
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.tags=[]; self.schemas=[]; self.capture=False; self.buffer=''
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs); self.tags.append((tag, attrs))
        if tag=='script' and attrs.get('type')=='application/ld+json': self.capture=True; self.buffer=''
    def handle_data(self, data):
        if self.capture: self.buffer+=data
    def handle_endtag(self, tag):
        if tag=='script' and self.capture:
            self.schemas.append(json.loads(self.buffer)); self.capture=False
    def select(self, tag): return [a for t,a in self.tags if t==tag]

pages={p.name:Page(p.read_text()) for p in ROOT.glob('*.html')}
errors=[]; canonicals=[]
for name,page in pages.items():
    def check(ok, message):
        if not ok: errors.append(f'{name}: {message}')
    check(len(page.select('h1'))==1,'must have one H1')
    check(len(page.select('main'))==1,'must have one main landmark')
    ids=[a['id'] for _,a in page.tags if 'id' in a]
    check(len(ids)==len(set(ids)),'duplicate IDs')
    canon=[a['href'] for a in page.select('link') if a.get('rel')=='canonical']
    check(len(canon)==1,'must have one canonical')
    indexable=name not in ['404.html','index2.html']
    if indexable:
        expected=ORIGIN+('/' if name=='index.html' else '/'+name[:-5])
        check(canon==[expected],'canonical does not match clean production route'); canonicals+=canon
        check(any(a.get('name')=='description' and a.get('content') for a in page.select('meta')),'missing description')
        check(any(a.get('property')=='og:url' and a.get('content')==expected for a in page.select('meta')),'incorrect OG URL')
        check(bool(page.schemas),'missing structured data')
    else: check(any(a.get('name')=='robots' and 'noindex' in a.get('content','') for a in page.select('meta')),'utility page must be noindex')
    for tag,a in page.tags:
        u=a.get('href') if tag in ['a','link'] else a.get('src') if tag in ['img','script'] else a.get('srcset') if tag=='source' else None
        if not u: continue
        parsed=urlsplit(u)
        check(parsed.scheme!='http','mixed-content URL')
        if parsed.scheme or parsed.netloc: continue
        dest=ROOT/(parsed.path.lstrip('/') or (name if parsed.fragment else 'index.html'))
        if not dest.is_file(): dest=dest.with_suffix('.html')
        check(dest.is_file(),f'missing local target {u}')
        if parsed.fragment and dest.name in pages:
            check(any(a.get('id')==parsed.fragment for _,a in pages[dest.name].tags),f'missing fragment {u}')
    for a in page.select('img'):
        check(all(a.get(k) for k in ['alt','width','height']),'image missing alt or dimensions')
    for form in page.select('form'):
        check(form.get('action')=='https://formspree.io/f/xojorllz','form destination changed')
        check(form.get('method','').upper()=='POST','form must POST')
    for a in page.select('label'):
        check(a.get('for') in ids,'label without matching input')
urls=[e.text for e in ET.parse(ROOT/'sitemap.xml').findall('.//{*}loc')]
assert sorted(urls)==sorted(canonicals),'Sitemap must match every indexable canonical exactly'
assert 'Sitemap: '+ORIGIN+'/sitemap.xml' in (ROOT/'robots.txt').read_text()
assert not (ROOT/'articles').exists(),'Blank file shadows the articles clean URL'
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML pages; {len(urls)} indexable canonical URLs; JSON-LD, local links/assets/fragments, form destinations, labels, image dimensions and sitemap.')
