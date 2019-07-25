\#!/bin/sh

JAVA_OPTS="-server -Xms256m -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1  -XX:+CMSClassUnloadingEnabled -XX:+UseGCOverheadLimit -Djava.awt.headless=true -XshowSettings:vm -Djava.security.egd=file:/dev/./urandom"

java $JAVA_OPTS -jar /app/application.jar
