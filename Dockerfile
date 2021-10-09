FROM denoland/deno:1.14.3

# Prefer not to run as root.
USER deno
WORKDIR /home/deno/srv

# Add app files
COPY bin bin
COPY app app
COPY lock.json lock.json
COPY .env .env

# Install dependencies
RUN deno cache --unstable --lock=lock.json app/deps.ts
RUN deno cache --unstable app/main.ts

EXPOSE 8000

# Executes the app
CMD [ "./bin/run" ]