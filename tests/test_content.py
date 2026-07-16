import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from build import EXPECTED_ROUTES, load_content, validate


class ContentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls): cls.data = validate(load_content())

    def test_all_json_files_parse(self):
        for path in (ROOT / "content").glob("*.json"):
            with self.subTest(path=path.name): json.loads(path.read_text(encoding="utf-8"))

    def test_slugs_and_routes_are_unique(self):
        items = self.data["projects"] + self.data["games"]
        self.assertEqual(len(items), len({i["slug"] for i in items}))
        self.assertEqual(len(EXPECTED_ROUTES), len(set(EXPECTED_ROUTES)))

    def test_expected_content_counts(self):
        self.assertEqual(6, len(self.data["projects"]))
        self.assertEqual(2, len(self.data["games"]))
        self.assertEqual(7, len(self.data["experience"]))
        self.assertEqual(9, len(self.data["lore"]))
        self.assertEqual(5, len(self.data["languages"]))
        self.assertEqual(8, len(self.data["wins"]))

    def test_no_framework_dependency(self):
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        dependencies = {**package.get("dependencies", {}), **package.get("devDependencies", {})}
        self.assertNotIn("react", dependencies)
        self.assertNotIn("next", dependencies)


if __name__ == "__main__": unittest.main()
