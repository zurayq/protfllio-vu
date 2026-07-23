import json
import re
import shutil
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from build import EXPECTED_ROUTES, build, output_path


class BuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.out = ROOT / "test-dist"
        build(cls.out, production=False)

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.out, ignore_errors=True)

    def test_every_route_generated(self):
        for route in EXPECTED_ROUTES:
            with self.subTest(route=route): self.assertTrue(output_path(self.out, route).exists())

    def test_page_contract(self):
        forbidden = ["href=\"#\"", "MathJax", "localhost", "react-dom", "next/static"]
        for route in EXPECTED_ROUTES:
            text = output_path(self.out, route).read_text(encoding="utf-8")
            with self.subTest(route=route):
                self.assertEqual(1, len(re.findall(r"<h1(?:\s|>)", text)))
                self.assertIn("<title>", text)
                self.assertIn('name="description"', text)
                self.assertIn('rel="canonical"', text)
                self.assertEqual(1, text.count("/assets/scripts/theme.js"))
                self.assertFalse(any(value in text for value in forbidden))

    def test_homepage_budget_and_script_isolation(self):
        text = (self.out / "index.html").read_text(encoding="utf-8")
        self.assertLess(len(text.encode()), 90_000)
        self.assertNotIn("matter.min.js", text.lower())
        self.assertNotIn("d3", text.lower())
        self.assertIsNone(re.search(r"<script[^>]+(?:three|d3|matter)", text, re.I))
        self.assertNotIn("for-visitors", text)
        self.assertNotIn("current-quest", text)
        self.assertEqual(4, text.count('class="experience-card"'))
        self.assertEqual(3, text.count('class="project-card project-card--compact"'))

    def test_interactive_route_contracts(self):
        toolbox = output_path(self.out, "/random/toolbox").read_text(encoding="utf-8")
        music = output_path(self.out, "/random/music").read_text(encoding="utf-8")
        travel = output_path(self.out, "/random/travel").read_text(encoding="utf-8")
        lore = output_path(self.out, "/random/lore").read_text(encoding="utf-8")
        role = output_path(self.out, "/game-lab/role-reveal-demo").read_text(encoding="utf-8")
        self.assertIn('data-toolbox-canvas', toolbox)
        self.assertIn('/assets/scripts/toolbox-game.js', toolbox)
        self.assertIn('/assets/vendor/matter.min.js', music)
        self.assertIn('data-music-stage', music)
        self.assertIn('/assets/vendor/d3.min.js', travel)
        self.assertIn('/assets/world/countries.json', (ROOT / "src" / "scripts" / "travel-globe.js").read_text(encoding="utf-8"))
        self.assertIn('data-lore-tree', lore)
        self.assertIn('data-role-card', role)
        self.assertIn('/assets/scripts/role-reveal.js', role)

    def test_source_art_is_copied_not_generated(self):
        self.assertFalse((self.out / "assets" / "generated").exists())
        expected = [
            "assets/profile/profile-silhouette.svg",
            "assets/projects/cv-bro.svg",
            "assets/projects/memocore.svg",
            "assets/projects/pasaporto.svg",
            "assets/games/imposter-cover.svg",
            "assets/music/artist-13.svg",
            "assets/travel/tripoli.svg",
            "assets/world/countries.json",
        ]
        for asset in expected:
            with self.subTest(asset=asset):
                self.assertTrue((self.out / asset).exists())

    def test_metadata_files(self):
        self.assertEqual("zurayq.xyz", (self.out / "CNAME").read_text().strip())
        sitemap = (self.out / "sitemap.xml").read_text(encoding="utf-8")
        self.assertEqual(len(EXPECTED_ROUTES), sitemap.count("<url>"))
        self.assertIn("sitemap.xml", (self.out / "robots.txt").read_text(encoding="utf-8").lower())


if __name__ == "__main__": unittest.main()
