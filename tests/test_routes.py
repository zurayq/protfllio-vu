import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from build import EXPECTED_ROUTES, output_path


class RouteTests(unittest.TestCase):
    def test_clean_directory_output_shape(self):
        out = ROOT / "dist"
        self.assertEqual(out / "index.html", output_path(out, "/"))
        for route in EXPECTED_ROUTES[1:]:
            with self.subTest(route=route): self.assertEqual("index.html", output_path(out, route).name)

    def test_internal_routes_have_no_html_suffix(self):
        self.assertTrue(all(not route.endswith(".html") for route in EXPECTED_ROUTES))

    def test_role_reveal_demo_is_validated(self):
        self.assertIn("/game-lab/role-reveal-demo", EXPECTED_ROUTES)


if __name__ == "__main__": unittest.main()
