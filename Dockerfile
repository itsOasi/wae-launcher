FROM python:3.9.13-slim-buster

# move bash into container
COPY init.sh /init.sh

# update apt and install git and pipenv
RUN ["chmod", "+x", "/init.sh"]
RUN /init.sh

# # create working directory and move server files into it
WORKDIR /
ADD wae /wae

# move bash into container
COPY run.sh /wae/run.sh

EXPOSE 8080/tcp
EXPOSE 8080/udp

# create environment and run server
RUN ["chmod", "+x", "/wae/run.sh"]
CMD ["wae/run.sh"]
