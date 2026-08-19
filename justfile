compose_args := `for f in docker-compose*.yaml; do printf -- "-f %s " "$f"; done`

up *FLAGS:
    docker compose {{compose_args}} up {{FLAGS}}
down *FLAGS:
    docker compose {{compose_args}} down {{FLAGS}}
ps:
    docker compose {{compose_args}} ps
log service:
    docker compose {{compose_args}} logs {{service}} -f
run command *FLAGS:
    docker compose {{compose_args}} {{command}} {{FLAGS}}