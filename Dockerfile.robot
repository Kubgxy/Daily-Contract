FROM selenium/standalone-chrome:latest

USER root

RUN pip install --upgrade pip && \
    pip install robotframework robotframework-seleniumlibrary

WORKDIR /opt/robotframework

ENTRYPOINT ["robot"]