# syntax=docker/dockerfile:1
# This Dockerfile is used to build the fNIRS web app for data streaming
#
# Quick Command to Build fNIRS Web App
# ====================================
# docker build -t fnirs:webapp .
#
# Quick Command to Run fNIRS Web App
# ==================================
# docker run --rm -it \
#     -e ALLOWED_USER=admin       # [ Optional : Username to access the portal ] \
#     -e ALLOWED_PASSWORD=admin   # [ Optional : Password to access the portal ] \
#     -e ALLOWED_AGE=86400000     # [ Optional : Secure cookie expiry age in milliseconds ] \
#     fnirs:webapp
#
# Main Build Script
# =================
#
# Pull node:current-alpine3.20 Image from Docker-Hub
FROM node@sha256:c9bb43423a6229aeddf3d16ae6aaa0ff71a0b2951ce18ec8fedb6f5d766cf286 AS frontendbuild
WORKDIR /home
COPY ./frontend ./frontend
WORKDIR ./frontend
RUN npm install
RUN npm run build

# Pull node:current-alpine3.20 Image from Docker-Hub for MultiStage Build
FROM node@sha256:c9bb43423a6229aeddf3d16ae6aaa0ff71a0b2951ce18ec8fedb6f5d766cf286 AS backendbuild
WORKDIR /home
COPY ./backend ./app
WORKDIR ./app
RUN npm install
RUN rm ./package*
COPY --from=frontendbuild /home/frontend/dist ./dist
EXPOSE 80
ENTRYPOINT [ "node", "./index.js" ]

# Pull python@sha256:00faa7c5ffa05fe03d364e4ee00c54abafa72410724ea535f8e9540b53c03774
FROM python@sha256:00faa7c5ffa05fe03d364e4ee00c54abafa72410724ea535f8e9540b53c03774 AS algorithmbuild
WORKDIR /home
COPY ./algorithm/requirements.txt ./requirements.txt
COPY ./algorithm/algoConnector.py ./algoConnector.py
RUN pip3 install -r ./requirements.txt
RUN rm ./requirements.txt
RUN chmod 777 ./algoConnector.py
ENTRYPOINT ["./algoConnector.py"]
