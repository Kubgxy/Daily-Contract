FROM selenium/standalone-chrome:latest

USER root

RUN pip install --upgrade pip && \
    pip install robotframework robotframework-seleniumlibrary

WORKDIR /opt/robotframework

# ✅ เพิ่ม COPY tests เข้า image
COPY ./tests ./tests

ENTRYPOINT ["robot"]
