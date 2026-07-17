# Team Git Workflow — Opz Billing Tool

## Team Roles

| Name | Role | GitHub Access |
|---|---|---|
| Lead (You) | Lead Developer | Admin |
| Sanjay | Contributor | Write |
| Shivani | Contributor | Write |
| Varshini | Contributor | Write |
| Yusuf | Supervisor | Read |

> **Note on Yusuf's Access:** Yusuf has visibility into all branches, commits, and PRs for supervision purposes, but does not contribute code directly. He may leave comments/feedback on PRs.

---

## Branch Strategy

```
main          ← Production-ready code. Protected. Never push directly.
develop       ← Integration branch. All feature PRs merge here first.
feature/<name>-<module>  ← Individual work branches
```

### Examples of valid branch names:
- `feature/sanjay-subscription-api`
- `feature/shivani-invoice-ui`
- `feature/varshini-payment-gateway`

---

## Daily Workflow

### Starting a new task

```bash
# 1. Make sure your local develop is up to date
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feature/<your-name>-<module>
```

### Committing your work

```bash
# Stage changes
git add .

# Commit with a meaningful message
git commit -m "feat: add subscription renewal logic"
```

### Commit message convention:
| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code cleanup |
| `docs:` | Documentation |
| `style:` | CSS / formatting |
| `chore:` | Config / build changes |

### Opening a Pull Request

```bash
# Push your feature branch
git push origin feature/<your-name>-<module>
```

Then on GitHub:
1. Go to the repo → **Pull Requests** → **New Pull Request**
2. Set **base** = `develop`, **compare** = your feature branch
3. Add a clear title and description
4. Request a review from the Lead or another contributor
5. Wait for approval before merging — do NOT self-merge

---

## Branch Protection Rules

| Branch | Rule |
|---|---|
| `main` | Require PR + 1 approval before merge |
| `develop` | Require PR + 1 approval before merge |

**Never** push directly to `main` or `develop`.

---

## Setting Up Locally (First Time)

```bash
# Clone the repo
git clone https://github.com/Sanjaydev-del/Opz-Billing-Tool.git
cd Opz-Billing-Tool

# Install frontend dependencies
cd frontend
npm install

# Run frontend dev server
npm run dev
```

For the backend, ensure you have Java 17+ and Maven installed. Then:
```bash
cd backend
./mvnw spring-boot:run
```

Or use Docker (recommended):
```bash
# From the project root
docker-compose up --build
```

---

## Code Review Checklist

Before approving a PR, reviewers should check:
- [ ] Code runs without errors
- [ ] No hardcoded secrets or credentials
- [ ] Follows existing naming conventions
- [ ] UI changes are consistent with the design system
- [ ] No direct commits to `main` or `develop`

---

## Emergency: Rolling Back a Bad Merge

```bash
# Find the commit hash before the bad merge
git log --oneline develop

# Revert to that commit (creates a new revert commit)
git revert <bad-commit-hash>
git push origin develop
```
