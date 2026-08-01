# 3-11 - Sociālo tīklu satura kalendārs / Social Media Content Calendar

The project files are organised in this repository root. Application source is split into `02_source_code/frontend` and `02_source_code/backend`.

## Project Purpose

Create a content calendar with channels, posts, approvals, assets, and publishing schedule.

## Practice Scope

This project is designed for one student during 160 hours of internship practice.

## Expected Learning Result

The student should demonstrate practical ability to analyse requirements, design a small application, prepare a database schema, implement source code, run the system in Docker, test the result, document the work, and publish the final project in GitHub.

## Required Technologies

Full-stack web application, REST API, relational database, authentication, role-based access, Docker Compose, automated tests, GitHub Actions.

## Required Repository Structure

The GitHub repository must follow the same folder structure as this package:

- 01_documentation
- 02_source_code
- 03_database
- 04_docker
- 05_tests
- 06_weekly_reports
- 07_screenshots_and_evidence
- 08_final_delivery

## Final Acceptance

The project is accepted only when Docker starts successfully, source code is pushed to GitHub, database scripts are present, test cases are documented, screenshots are added, and the final internship report is completed.

## Run the Application

Requirements: Docker Engine with the Compose plugin. From the project root, start the app and database:

```bash
docker compose -f 04_docker/3-11_docker-compose.yml up -d --build
```

Open http://localhost:8080. The demo calendar uses fictional seed content. The local role selector demonstrates administrator, editor, and guest permissions; this practice app does not implement production authentication.

Check services and stop them:

```bash
docker compose -f 04_docker/3-11_docker-compose.yml ps
docker compose -f 04_docker/3-11_docker-compose.yml down
```

Detailed instructions are in `04_docker/3-11_05_Docker_Instructions.md`; database design is in `03_database/3-11_04_Database_Schema.md`.
