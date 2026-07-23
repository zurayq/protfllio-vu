from __future__ import annotations

import argparse
import json
import os
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
    "/projects/retail-category-predictor", "/projects/lidar-visualization",
    "/game-lab", "/game-lab/imposter", "/game-lab/tower-defense",
    "/game-lab/role-reveal-demo", "/random/lore", "/random/toolbox",
    "/random/music", "/random/travel", "/random/languages", "/random/wins",
]
FORBIDDEN = [
    "Andrew", "Andy", "adv-andrew", "iStaridium", "GatorAI", "Adtran",
    "NVIDIA", "Gamefam", "Roblox", "UCF", "sagarreddypatil",
]


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
    project_order = [
        "cv-bro", "memocore", "pasaporto", "article-network-analysis",
        "retail-category-predictor", "lidar-visualization",
    ]
    game_order = ["imposter", "tower-defense"]
    data["projects"].sort(key=lambda x: project_order.index(x.get("slug")) if x.get("slug") in project_order else 999)
    data["games"].sort(key=lambda x: game_order.index(x.get("slug")) if x.get("slug") in game_order else 999)

    project_covers = {
        "cv-bro": "cv-bro.svg",
        "memocore": "memocore.svg",
        "pasaporto": "pasaporto.svg",
        "article-network-analysis": "article-network.svg",
        "retail-category-predictor": "retail-predictor.svg",
        "lidar-visualization": "lidar.svg",
    }
    for project in data["projects"]:
        project["cover"] = f"/assets/projects/{project_covers[project['slug']]}"
    game_covers = {"imposter": "imposter-cover.svg", "tower-defense": "tower-defense.svg"}
    for game in data["games"]:
        game["cover"] = f"/assets/games/{game_covers[game['slug']]}"

    featured_orgs = [
        "TAISAT Teknofest Team", "Lybotics Asteroids Robotics Team",
        "English Time, Körfez", "American Life, Kocaeli",
    ]
    data["featured_experience"] = [
        next(entry for entry in data["experience"] if entry["organization"] == name)
        for name in featured_orgs
    ]
    tool_names = [
        "C#", "Java", "Python", "JavaScript", "C", "Git", "SQL", ".NET",
        "FastAPI", "Next.js", "React", "Supabase", "Three.js", "SDL3",
        "Altium Designer", "Unity",
    ]
    by_name = {tool["name"]: tool for tool in data["toolbox"]}
    data["toolbox_game_tools"] = [by_name[name] for name in tool_names]
    lore_files = [
        ("about_me.txt", "life/"),
        ("why_computer_engineering.md", "engineering/"),
        ("why_game_development.md", "games/"),
        ("moving_to_turkiye.log", "life/"),
        ("teaching_arc.txt", "teaching/"),
        ("robotics_lore.md", "robotics/"),
        ("internship_search.log", "engineering/"),
        ("currently_building.txt", "games/"),
        ("long_term_goal.save", "life/"),
    ]
    for item, (filename, folder) in zip(data["lore"], lore_files):
        item["filename"] = filename
        item["folder"] = folder
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
            errors.append(f"{source}: last_updated must be a string")
    for entry in data["experience"]:
        if not isinstance(entry.get("date"), str):
            errors.append(f"experience.json: invalid date for {entry.get('organization')}")
    actual = {
        "/", "/resources", "/projects", "/game-lab", "/game-lab/role-reveal-demo",
        "/random/lore", "/random/toolbox", "/random/music", "/random/travel",
        "/random/languages", "/random/wins",
    }
    actual.update(item.get("route") for item in items)
    if set(EXPECTED_ROUTES) != actual:
        missing = sorted(set(EXPECTED_ROUTES) - actual)
        extra = sorted(actual - set(EXPECTED_ROUTES))
        if missing:
            errors.append("Missing expected routes: " + ", ".join(missing))
        if extra:
            errors.append("Unexpected routes: " + ", ".join(extra))
    internal_refs = paths + [item["path"] for item in data["site"]["home"]["random"]["items"]]
    for card in data["site"]["resources"]:
        internal_refs.extend(
            button["path"] for button in card.get("buttons", [])
            if button["path"].startswith("/") and not button.get("cv")
        )
    for ref in internal_refs:
        if ref not in actual:
            errors.append(f"Broken internal content reference: {ref}")
    if errors:
        raise ContentError("Content validation failed:\n- " + "\n- ".join(errors))
    return data


class PageInspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.images, self.h1_count = [], [], 0
        self.has_title = self.has_description = self.has_canonical = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a":
            self.links.append(attrs.get("href"))
        if tag == "img":
            self.images.append(attrs)
        if tag == "h1":
            self.h1_count += 1
        if tag == "title":
            self.has_title = True
        if tag == "meta" and attrs.get("name") == "description":
            self.has_description = True
        if tag == "link" and attrs.get("rel") == "canonical":
            self.has_canonical = True


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
        if production:
            raise ContentError("Tailwind CLI is missing. Run pnpm install first.")
        shutil.copy2(ROOT / "src" / "index.css", out / "assets" / "site.css")
        return
    command = [str(binary), "-i", str(ROOT / "src" / "index.css"), "-o", str(out / "assets" / "site.css")]
    if production:
        command.append("--minify")
    result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    if result.returncode:
        raise ContentError("Tailwind build failed:\n" + result.stderr)


def copy_vendor(out: Path) -> list[str]:
    vendor = out / "assets" / "vendor"
    vendor.mkdir(parents=True, exist_ok=True)
    packages = [
        (ROOT / "node_modules/matter-js/build/matter.min.js", vendor / "matter.min.js"),
        (ROOT / "node_modules/d3/dist/d3.min.js", vendor / "d3.min.js"),
        (ROOT / "node_modules/topojson-client/dist/topojson-client.min.js", vendor / "topojson-client.min.js"),
    ]
    missing = []
    for source, target in packages:
        if source.exists():
            shutil.copy2(source, target)
        else:
            missing.append(source.name)
    return missing


def validate_output(out: Path) -> int:
    route_set = set(EXPECTED_ROUTES)
    link_count = 0
    errors = []
    for route in EXPECTED_ROUTES:
        file = output_path(out, route)
        if not file.exists():
            errors.append(f"Missing generated route: {route}")
            continue
        text = file.read_text(encoding="utf-8")
        inspector = PageInspector()
        inspector.feed(text)
        if not inspector.has_title or not inspector.has_description or not inspector.has_canonical:
            errors.append(f"{route}: missing required metadata")
        if inspector.h1_count != 1:
            errors.append(f"{route}: expected one h1, found {inspector.h1_count}")
        for attrs in inspector.images:
            if "alt" not in attrs:
                errors.append(f"{route}: image missing alt")
            src = attrs.get("src", "")
            if src.startswith(("http://", "https://")):
                errors.append(f"{route}: external image hotlink")
            elif src.startswith("/assets/") and not (out / src.lstrip("/")).exists():
                errors.append(f"{route}: broken image {src}")
        for href in inspector.links:
            if not href or href == "#":
                errors.append(f"{route}: empty or placeholder href")
                continue
            if href.startswith(("mailto:", "http://", "https://", "#")):
                continue
            link_count += 1
            target = urlparse(href).path.rstrip("/") or "/"
            if target.startswith("/assets/"):
                if not (out / target.lstrip("/")).exists():
                    errors.append(f"{route}: broken asset link {href}")
            elif target not in route_set:
                errors.append(f"{route}: broken internal link {href}")
        for bad in FORBIDDEN:
            if bad.lower() in text.lower():
                errors.append(f"{route}: forbidden production string {bad}")
        if "localhost" in text or 'href="tel:' in text.lower() or '"telephone"' in text.lower():
            errors.append(f"{route}: localhost or telephone content detected")
    if errors:
        raise ContentError("Generated output validation failed:\n- " + "\n- ".join(errors))
    return link_count


def build(output: str | Path = "dist", production: bool = False) -> dict:
    data = validate()
    out = (ROOT / output).resolve() if not Path(output).is_absolute() else Path(output).resolve()
    clean_output(out)
    shutil.copytree(PUBLIC, out, dirs_exist_ok=True)
    shutil.copytree(ROOT / "src" / "scripts", out / "assets" / "scripts", dirs_exist_ok=True)
    compile_css(out, production)
    missing_vendor = copy_vendor(out)

    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(ROOT / "src" / "templates"),
        autoescape=jinja2.select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    cv_exists = (PUBLIC / data["profile"]["cv_path"].lstrip("/")).exists()
    warnings = []
    if not cv_exists:
        warnings.append("CV missing: the header shows ‘CV updating’.")
    if missing_vendor:
        warnings.append("Missing vendor files: " + ", ".join(missing_vendor))
    base = {**data, "cv_exists": cv_exists}
    person_ld = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": data["profile"]["full_name"],
        "url": data["profile"]["website"],
        "sameAs": [data["profile"]["github"], data["profile"]["linkedin"]],
        "homeLocation": {"@type": "Place", "name": "İzmit, Kocaeli, Türkiye"},
        "affiliation": {"@type": "CollegeOrUniversity", "name": data["profile"]["university"]},
    }

    pages = [
        ("/", "index.html", {"title": data["site"]["homepage_title"], "description": data["site"]["homepage_description"]}, {}),
        ("/resources", "resources.html", data["site"]["pages"]["resources"], {"page": data["site"]["pages"]["resources"]}),
        ("/projects", "projects/list.html", data["site"]["pages"]["projects"], {"page": data["site"]["pages"]["projects"]}),
        ("/game-lab", "games/list.html", data["site"]["pages"]["game_lab"], {"page": data["site"]["pages"]["game_lab"]}),
        ("/game-lab/role-reveal-demo", "games/role-reveal-demo.html", {
            "title": "Role Reveal Prototype — Game Lab — Abdulwahid Zurayq",
            "description": "A press-and-hold interaction prototype for the multilingual Imposter party game.",
        }, {}),
        ("/random/lore", "random/lore.html", data["site"]["pages"]["lore"], {"page": data["site"]["pages"]["lore"]}),
        ("/random/toolbox", "random/toolbox.html", data["site"]["pages"]["toolbox"], {"page": data["site"]["pages"]["toolbox"]}),
        ("/random/music", "random/music.html", data["site"]["pages"]["music"], {"page": data["site"]["pages"]["music"]}),
        ("/random/travel", "random/travel.html", data["site"]["pages"]["travel"], {"page": data["site"]["pages"]["travel"]}),
        ("/random/languages", "random/languages.html", data["site"]["pages"]["languages"], {"page": data["site"]["pages"]["languages"]}),
        ("/random/wins", "random/wins.html", data["site"]["pages"]["wins"], {"page": data["site"]["pages"]["wins"]}),
    ]
    for item in data["projects"]:
        pages.append((
            item["route"], "projects/detail.html",
            {"title": f"{item['title']} — Abdulwahid Zurayq", "description": item["summary"]},
            {"item": item},
        ))
    for item in data["games"]:
        pages.append((
            item["route"], "games/detail.html",
            {"title": f"{item['title']} — Game Lab — Abdulwahid Zurayq", "description": item["summary"]},
            {"item": item},
        ))

    for route, template_name, meta, context in pages:
        json_ld = person_ld
        if "item" in context:
            item = context["item"]
            json_ld = {
                "@context": "https://schema.org",
                "@type": "VideoGame" if item in data["games"] else "CreativeWork",
                "name": item["title"], "description": item["summary"],
                "url": data["site"]["domain"] + route, "author": person_ld,
            }
        target = output_path(out, route)
        target.parent.mkdir(parents=True, exist_ok=True)
        template = env.get_template(template_name)
        target.write_text(
            template.render(**base, route=route, meta=meta, json_ld=json_ld, **context),
            encoding="utf-8",
        )

    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(
            f"  <url><loc>{data['site']['domain']}{route if route != '/' else '/'}</loc></url>"
            for route in EXPECTED_ROUTES
        )
        + "\n</urlset>\n"
    )
    (out / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    (out / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\nSitemap: {data['site']['domain']}/sitemap.xml\n",
        encoding="utf-8",
    )
    (out / "CNAME").write_text("zurayq.xyz\n", encoding="utf-8")
    links = validate_output(out)
    report = {"pages": len(pages), "links": links, "assets": 0, "warnings": warnings}
    print(f"Generated pages: {report['pages']}")
    print(f"Validated internal links: {report['links']}")
    print("Generated placeholder assets: 0")
    print(f"Warnings: {len(warnings)}")
    for warning in warnings:
        print(f"WARNING: {warning}")
    print("Build completed successfully.")
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build zurayq.xyz static HTML")
    parser.add_argument("--output", default="dist")
    parser.add_argument("--production", action="store_true")
    args = parser.parse_args()
    try:
        build(args.output, args.production)
    except ContentError as exc:
        print(f"BUILD ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
