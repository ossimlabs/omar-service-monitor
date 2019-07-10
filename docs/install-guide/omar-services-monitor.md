# OMAR-Services-Monitor

## Purpose

The OMAR-Services-Monitor serves as a easy one-stop interface to keep up with any errors that might be arising in deployed applications, making it much easier to catch these errors before they snowball out of control.

## Installation in Openshift

**Assumption:** The omar-services-monitor docker image is pushed into the OpenShift server's internal docker registry and available to the project.

### Environment variables

|Variable|Value|
|------|------|
|SPRING_PROFILES_ACTIVE|Comma separated profile tags (*e.g. production, dev*)|