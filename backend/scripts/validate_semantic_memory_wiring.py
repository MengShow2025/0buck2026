import os


def main() -> int:
    base = os.path.dirname(os.path.dirname(__file__))
    agent_path = os.path.join(base, "app", "services", "agent.py")
    butler_path = os.path.join(base, "app", "services", "butler_service.py")

    with open(agent_path, "r", encoding="utf-8") as f:
        agent_src = f.read()
    with open(butler_path, "r", encoding="utf-8") as f:
        butler_src = f.read()

    if "assemble_persona_prompt(user_id, last_user_msg" not in agent_src:
        print("agent does not pass last_user_msg into assemble_persona_prompt")
        return 1
    if "semantic_memory_service.search" not in butler_src:
        print("butler_service missing semantic_memory_service.search")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

