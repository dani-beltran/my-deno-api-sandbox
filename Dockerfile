FROM denoland/deno:1.14.3

# Prefer not to run as root.
USER deno
WORKDIR /home/deno/srv

# Install dependencies
COPY deps.ts deps.ts
COPY lock.json lock.json
RUN deno cache --unstable --lock=lock.json deps.ts

# Add source code
COPY bin bin
COPY app app

EXPOSE 8000

# Executes the app
CMD [ "./bin/run" ]