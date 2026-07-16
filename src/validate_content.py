from build import ContentError, validate

if __name__ == "__main__":
    try:
        data = validate()
        print(f"Content valid: {len(data['projects'])} projects, {len(data['games'])} games.")
    except ContentError as exc:
        print(exc)
        raise SystemExit(1)
