plugins {
    kotlin("jvm") version "2.0.21"
    application
}

repositories { mavenCentral() }

dependencies {
    implementation("io.socket:socket.io-client:2.1.1")
}

application {
    mainClass.set("MainKt")
}

kotlin { jvmToolchain(17) }
