# GitHub Actions Workflows

This directory will contain CI/CD workflows.

The first planned workflow is backend CI. It will:

1. Install Python dependencies.
2. Start PostgreSQL.
3. Apply Alembic migrations.
4. Seed fictional demo data.
5. Run pytest.

Future workflows will separately validate the React Native / Expo frontend application in the 
'frontend directory/'.
