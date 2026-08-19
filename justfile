compose_args := `for f in docker-compose*.yaml; do printf -- "-f %s " "$f"; done`

up:
    podman compose {{compose_args}} up --build -d
down:
    podman compose {{compose_args}} down
ps:
    podman compose {{compose_args}} ps