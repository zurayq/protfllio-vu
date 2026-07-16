from __future__ import annotations

import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

import jinja2
import markdown
import yaml

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
PUBLIC = ROOT / "public"
EXPECTED_ROUTES = [
    "/", "/resources", "/projects", "/projects/cv-bro", "/projects/memocore",
    "/projects/pasaporto", "/projects/article-network-analysis",
    "/projects/retail-category-predictor", "/projects/lidar-visualization", "/game-lab",
    "/game-lab/imposter", "/game-lab/tower-defense", "/random/lore", "/random/toolbox",
    "/random/music", "/random/travel", "/random/languages", "/random/wins",
]
FORBIDDEN = ["Andrew", "Andy", "adv-andrew", "iStaridium", "GatorAI", "Adtran", "NVIDIA", "Gamefam", "Roblox", "UCF", "sagarreddypatil"]


class ContentError(RuntimeError):
    pass


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ContentError(f"Malformed JSON in {path.relative_to(ROOT)}: {exc}") from exc


def load_markdown(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    if not raw.startswith("---\n") or "\n---\n" not in raw[4:]:
        raise ContentError(f"Missing YAML front matter in {path.relative_to(ROOT)}")
    front, body = raw[4:].split("\n---\n", 1)
    try:
        data = yaml.safe_load(front) or {}
    except yaml.YAMLError as exc:
        raise ContentError(f"Malformed front matter in {path.relative_to(ROOT)}: {exc}") from exc
    if not isinstance(data, dict):
        raise ContentError(f"Front matter must be an object in {path.relative_to(ROOT)}")
    data["content_html"] = markdown.markdown(body, extensions=["extra", "sane_lists"])
    data["source_file"] = str(path.relative_to(ROOT))
    return data


def load_content() -> dict:
    data = {
        "profile": load_json(CONTENT / "profile.json"),
        "navigation": load_json(CONTENT / "navigation.json"),
        "site": load_json(CONTENT / "site.json"),
        "experience": load_json(CONTENT / "experience.json"),
        "toolbox": load_json(CONTENT / "toolbox.json"),
        "music": load_json(CONTENT / "music.json"),
        "travel": load_json(CONTENT / "travel.json"),
        "languages": load_json(CONTENT / "languages.json"),
        "wins": load_json(CONTENT / "wins.json"),
        "lore": load_json(CONTENT / "lore.json"),
        "projects": [load_markdown(p) for p in sorted((CONTENT / "projects").glob("*.md"))],
        "games": [load_markdown(p) for p in sorted((CONTENT / "games").glob("*.md"))],
    }
    project_order = ["cv-bro", "memocore", "pasaporto", "article-network-analysis", "retail-category-predictor", "lidar-visualization"]
    game_order = ["imposter", "tower-defense"]
    data["projects"].sort(key=lambda x: project_order.index(x.get("slug")) if x.get("slug") in project_order else 999)
    data["games"].sort(key=lambda x: game_order.index(x.get("slug")) if x.get("slug") in game_order else 999)
    return data


def validate(data: dict | None = None) -> dict:
    data = data or load_content()
    errors: list[str] = []
    items = data["projects"] + data["games"]
    slugs = [item.get("slug") for item in items]
    if len(slugs) != len(set(slugs)):
        errors.append("Duplicate slugs found in project/game content")
    paths = [item.get("path") for item in data["navigation"]]
    if len(paths) != len(set(paths)):
        errors.append("Duplicate navigation path found")
    for item in items:
        source = item.get("source_file", "content item")
        for field in ("title", "slug", "route", "status", "summary", "stack"):
            if not item.get(field):
                errors.append(f"{source}: missing required {field}")
        route = item.get("route", "")
        if not isinstance(route, str) or not route.startswith("/") or route.endswith(".html"):
            errors.append(f"{source}: invalid route {route!r}")
        if "last_updated" in item and not isinstance(item["last_updated"], str):
            errors.append(f"{source}: invalid date field type; last_updated must be a string")
    for entry in data["experience"]:
        if not isinstance(entry.get("date"), str):
            errors.append(f"experience.json: invalid date field type for {entry.get('organization')}")
    actual = {"/", "/resources", "/projects", "/game-lab", "/random/lore", "/random/toolbox", "/random/music", "/random/travel", "/random/languages", "/random/wins"}
    actual.update(item.get("route") for item in items)
    missing = sorted(set(EXPECTED_ROUTES) - actual)
    extra = sorted(actual - set(EXPECTED_ROUTES))
    if missing:
        errors.append("Missing expected routes: " + ", ".join(missing))
    if extra:
        errors.append("Unexpected routes: " + ", ".join(extra))
    internal_refs: list[str] = []
    internal_refs.extend(paths)
    for card in data["site"]["resources"]:
        internal_refs.extend(b["path"] for b in card.get("buttons", []) if b["path"].startswith("/") and not b.get("cv"))
    internal_refs.extend(i["path"] for i in data["site"]["home"]["random"]["items"])
    for ref in internal_refs:
        if ref not in actual:
            errors.append(f"Broken internal content reference: {ref}")
    if errors:
        raise ContentError("Content validation failed:\n- " + "\n- ".join(errors))
    return data


def placeholder_svg(title: str, width: int = 1120, height: int = 680, motif: str = "nodes") -> str:
    safe = html.escape(title)
    shapes = {
        "nodes": '<circle cx="265" cy="290" r="44"/><circle cx="560" cy="190" r="34"/><circle cx="830" cy="400" r="52"/><path d="M304 273 526 202M589 218l198 151M303 314l478 78"/>',
        "grid": '<path d="M210 150h700v380H210zM350 150v380M490 150v380M630 150v380M770 150v380M210 245h700M210 340h700M210 435h700"/><circle cx="490" cy="340" r="48"/><path d="M770 245h70v70h-70z"/>',
        "globe": '<circle cx="560" cy="330" r="210"/><path d="M350 330h420M560 120c-70 75-82 148-72 210 10 70 34 139 72 210M560 120c70 75 82 148 72 210-10 70-34 139-72 210"/>',
        "cloud": '<g fill="#4d633b" stroke="none"><circle cx="300" cy="280" r="5"/><circle cx="330" cy="250" r="7"/><circle cx="390" cy="340" r="6"/><circle cx="470" cy="220" r="5"/><circle cx="550" cy="370" r="8"/><circle cx="650" cy="260" r="6"/><circle cx="710" cy="390" r="5"/><circle cx="820" cy="230" r="8"/><circle cx="860" cy="350" r="6"/></g>',
    }.get(motif, "")
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 1120 680"><rect width="1120" height="680" fill="#e9e5da"/><rect x="22" y="22" width="1076" height="636" fill="#fbfaf6" stroke="#262822" stroke-width="3"/><g fill="none" stroke="#4d633b" stroke-width="6">{shapes}</g><text x="58" y="86" fill="#1c1e1a" font-family="monospace" font-size="30" font-weight="700">{safe}</text><text x="58" y="625" fill="#6d7067" font-family="monospace" font-size="18">LOCAL PLACEHOLDER · REPLACE WHEN A REAL SCREENSHOT EXISTS</text></svg>'''


def write_generated_assets(out: Path, data: dict) -> int:
    generated = out / "assets" / "generated"
    profile_dir = out / "assets" / "profile"
    music_dir = out / "assets" / "music"
    generated.mkdir(parents=True, exist_ok=True)
    profile_dir.mkdir(parents=True, exist_ok=True)
    music_dir.mkdir(parents=True, exist_ok=True)
    motifs = {"cv-bro":"nodes", "memocore":"nodes", "pasaporto":"globe", "article-network-analysis":"nodes", "retail-category-predictor":"grid", "lidar-visualization":"cloud", "imposter":"nodes", "tower-defense":"grid"}
    for item in data["projects"] + data["games"]:
        size = (1600, 1000) if item in data["games"] else (1120, 680)
        (generated / f"{item['slug']}.svg").write_text(placeholder_svg(item["title"], *size, motifs[item["slug"]]), encoding="utf-8")
    for name, label in (("me.svg", "YOUR PHOTO\n1200 × 1500"), ("me-alt.svg", "ALT PHOTO\n1200 × 1500")):
        lines = label.split("\n")
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500"><rect width="1200" height="1500" fill="#e9e5da"/><rect x="40" y="40" width="1120" height="1420" fill="#fbfaf6" stroke="#262822" stroke-width="8"/><path d="M280 1120c70-220 240-330 320-330s250 110 320 330" fill="none" stroke="#4d633b" stroke-width="24"/><circle cx="600" cy="545" r="190" fill="none" stroke="#4d633b" stroke-width="24"/><text x="600" y="1280" text-anchor="middle" fill="#1c1e1a" font-family="monospace" font-size="64" font-weight="700">{lines[0]}</text><text x="600" y="1360" text-anchor="middle" fill="#6d7067" font-family="monospace" font-size="38">{lines[1]}</text></svg>'''
        (profile_dir / name).write_text(svg, encoding="utf-8")
    for index, artist in enumerate(data["music"]["artists"], 1):
        safe = html.escape(artist)
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="264" height="192"><rect width="264" height="192" fill="#fbfaf6"/><rect x="4" y="4" width="256" height="184" fill="none" stroke="#262822" stroke-width="3"/><circle cx="70" cy="92" r="42" fill="#4d633b"/><circle cx="70" cy="92" r="11" fill="#e9e5da"/><text x="130" y="82" fill="#1c1e1a" font-family="monospace" font-size="14" font-weight="700">{safe}</text><text x="130" y="108" fill="#6d7067" font-family="monospace" font-size="11">record card {index:02d}</text></svg>'''
        (music_dir / f"artist-{index}.svg").write_text(svg, encoding="utf-8")
    return len(data["projects"]) + len(data["games"]) + 2 + len(data["music"]["artists"])


class PageInspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.images, self.h1_count = [], [], 0
        self.has_title = self.has_description = self.has_canonical = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a": self.links.append(attrs.get("href"))
        if tag == "img": self.images.append(attrs)
        if tag == "h1": self.h1_count += 1
        if tag == "title": self.has_title = True
        if tag == "meta" and attrs.get("name") == "description": self.has_description = True
        if tag == "link" and attrs.get("rel") == "canonical": self.has_canonical = True


def output_path(out: Path, route: str) -> Path:
    return out / "index.html" if route == "/" else out / route.strip("/") / "index.html"


def clean_output(out: Path) -> None:
    resolved = out.resolve()
    root = ROOT.resolve()
    if resolved == root or root not in resolved.parents:
        raise ContentError(f"Refusing to clean unsafe output path: {resolved}")
    if resolved.exists():
        def unlock_and_retry(function, path, error):
            try:
                os.chmod(path, 0o700)
                function(path)
            except OSError:
                raise error
        shutil.rmtree(resolved, onexc=unlock_and_retry)
    resolved.mkdir(parents=True)


def compile_css(out: Path, production: bool) -> None:
    binary = ROOT / "node_modules" / ".bin" / ("tailwindcss.cmd" if os.name == "nt" else "tailwindcss")
    if not binary.exists():
        if production: raise ContentError("Tailwind CLI is missing. Run pnpm install first.")
        shutil.copy2(ROOT / "src" / "index.css", out / "assets" / "site.css")
        return
    command = [str(binary), "-i", str(ROOT / "src" / "index.css"), "-o", str(out / "assets" / "site.css")]
    if production: command.append("--minify")
    result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    if result.returncode: raise ContentError("Tailwind build failed:\n" + result.stderr)


def validate_output(out: Path) -> int:
    route_set = set(EXPECTED_ROUTES)
    link_count = 0
    errors = []
    for route in EXPECTED_ROUTES:
        file = output_path(out, route)
        if not file.exists(): errors.append(f"Missing generated route: {route}"); continue
        text = file.read_text(encoding="utf-8")
        inspector = PageInspector(); inspector.feed(text)
        if not inspector.has_title or not inspector.has_description or not inspector.has_canonical: errors.append(f"{route}: missing required metadata")
        if inspector.h1_count != 1: errors.append(f"{route}: expected one h1, found {inspector.h1_count}")
        for attrs in inspector.images:
            if "alt" not in attrs: errors.append(f"{route}: image missing alt")
            if attrs.get("src", "").startswith(("http://", "https://")): errors.append(f"{route}: external image hotlink")
        for href in inspector.links:
            if not href or href == "#": errors.append(f"{route}: empty or placeholder href"); continue
            if href.startswith(("mailto:", "http://", "https://", "#")): continue
            link_count += 1
            target = urlparse(href).path.rstrip("/") or "/"
            if target.startswith("/assets/"):
                if not (out / target.lstrip("/")).exists(): errors.append(f"{route}: broken asset link {href}")
            elif target not in route_set: errors.append(f"{route}: broken internal link {href}")
        for bad in FORBIDDEN:
            if bad.lower() in text.lower(): errors.append(f"{route}: forbidden production string {bad}")
        if "localhost" in text or 'href="tel:' in text.lower() or '"telephone"' in text.lower():
            errors.append(f"{route}: localhost or telephone content detected")
    if errors: raise ContentError("Generated output validation failed:\n- " + "\n- ".join(errors))
    return link_count


def build(output: str | Path = "dist", production: bool = False) -> dict:
    data = validate()
    out = (ROOT / output).resolve() if not Path(output).is_absolute() else Path(output).resolve()
    clean_output(out)
    shutil.copytree(PUBLIC, out, dirs_exist_ok=True)
    (out / "assets" / "scripts").mkdir(parents=True, exist_ok=True)
    scripts_src = ROOT / "src" / "scripts"
    if scripts_src.exists(): shutil.copytree(scripts_src, out / "assets" / "scripts", dirs_exist_ok=True)
    assets_generated = write_generated_assets(out, data)
    compile_css(out, production)
    matter_src = ROOT / "node_modules" / "matter-js" / "build" / "matter.min.js"
    if matter_src.exists():
        vendor = out / "assets" / "vendor"; vendor.mkdir(parents=True, exist_ok=True); shutil.copy2(matter_src, vendor / "matter.min.js")
    env = jinja2.Environment(loader=jinja2.FileSystemLoader(ROOT / "src" / "templates"), autoescape=jinja2.select_autoescape(["html"]), trim_blocks=True, lstrip_blocks=True)
    template = env.get_template("page.html")
    cv_exists = (PUBLIC / data["profile"]["cv_path"].lstrip("/")).exists()
    warnings = []
    if not cv_exists: warnings.append("CV missing: header shows ‘CV updating’ and CV links are omitted.")
    if not matter_src.exists(): warnings.append("Matter.js missing: music page will use its static reduced-motion fallback until pnpm install runs.")
    base = {**data, "cv_exists": cv_exists}
    person_ld = {"@context":"https://schema.org","@type":"Person","name":data["profile"]["full_name"],"url":data["profile"]["website"],"sameAs":[data["profile"]["github"],data["profile"]["linkedin"]],"homeLocation":{"@type":"Place","name":"İzmit, Kocaeli, Türkiye"},"affiliation":{"@type":"CollegeOrUniversity","name":data["profile"]["university"],"description":"Current Computer Engineering student affiliation"}}
    pages = [
        ("/", "home", {"title":data["site"]["homepage_title"],"description":data["site"]["homepage_description"]}, {}, ["portrait.js","accordion.js"]),
        ("/resources", "resources", data["site"]["pages"]["resources"], {"page":data["site"]["pages"]["resources"]}, []),
        ("/projects", "projects", data["site"]["pages"]["projects"], {"page":data["site"]["pages"]["projects"]}, ["project-filter.js"]),
        ("/game-lab", "game_lab", data["site"]["pages"]["game_lab"], {"page":data["site"]["pages"]["game_lab"]}, []),
        ("/random/lore", "lore", data["site"]["pages"]["lore"], {"page":data["site"]["pages"]["lore"]}, ["accordion.js"]),
        ("/random/toolbox", "toolbox", data["site"]["pages"]["toolbox"], {"page":data["site"]["pages"]["toolbox"]}, ["toolbox.js"]),
        ("/random/music", "music", data["site"]["pages"]["music"], {"page":data["site"]["pages"]["music"]}, ["music-physics.js"]),
        ("/random/travel", "travel", data["site"]["pages"]["travel"], {"page":data["site"]["pages"]["travel"]}, ["travel-globe.js"]),
        ("/random/languages", "languages", data["site"]["pages"]["languages"], {"page":data["site"]["pages"]["languages"]}, ["languages.js"]),
        ("/random/wins", "wins", data["site"]["pages"]["wins"], {"page":data["site"]["pages"]["wins"]}, []),
    ]
    for item in data["projects"]:
        item["command"] = f"open ~/projects/{item['slug']}.md"
        meta = {"title":f"{item['title']} — Abdulwahid Zurayq", "description":item["summary"]}
        pages.append((item["route"], "detail", meta, {"item":item,"detail_type":"project"}, []))
    for item in data["games"]:
        meta = {"title":f"{item['title']} — Game Lab — Abdulwahid Zurayq", "description":item["summary"]}
        pages.append((item["route"], "detail", meta, {"item":item,"detail_type":"game"}, []))
    for route, kind, meta, context, scripts in pages:
        json_ld = person_ld
        if kind == "detail":
            item = context["item"]
            json_ld = {"@context":"https://schema.org","@type":"VideoGame" if context["detail_type"] == "game" else "CreativeWork","name":item["title"],"description":item["summary"],"url":data["site"]["domain"]+route,"author":person_ld}
        target = output_path(out, route); target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(template.render(**base, route=route, kind=kind, meta=meta, scripts=scripts, json_ld=json_ld, **context), encoding="utf-8")
    sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + "\n".join(f"  <url><loc>{data['site']['domain']}{route if route != '/' else '/'}</loc></url>" for route in EXPECTED_ROUTES) + "\n</urlset>\n"
    (out / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    (out / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {data['site']['domain']}/sitemap.xml\n", encoding="utf-8")
    (out / "CNAME").write_text("zurayq.xyz\n", encoding="utf-8")
    links = validate_output(out)
    report = {"pages":len(pages),"links":links,"assets":assets_generated,"warnings":warnings}
    print(f"Generated pages: {report['pages']}")
    print(f"Validated internal links: {report['links']}")
    print("Optimized images: 0 (SVG placeholders need no raster optimization)")
    print(f"Warnings: {len(warnings)}")
    for warning in warnings: print(f"WARNING: {warning}")
    print("Build completed successfully.")
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build zurayq.xyz static HTML")
    parser.add_argument("--output", default="dist")
    parser.add_argument("--production", action="store_true")
    args = parser.parse_args()
    try: build(args.output, args.production)
    except ContentError as exc:
        print(f"BUILD ERROR: {exc}", file=sys.stderr); raise SystemExit(1)
