ARGUMENTS = $(filter-out $@,$(MAKECMDGOALS))

# Add this at the beginning of your Makefile
.PHONY: help
help:
	@echo "Available commands:"
	@echo
	@echo "Bundle:"
	@echo "  bundle                  - Bundle the package"
	@echo
	@echo "Changelog:"
	@echo "  changelog               - Update CHANGELOG.md with changes between the last two release commits"
	@echo
	@echo "npm:"
	@echo "  npm-publish             - Publish npm packages"
	@echo "  npm-dry                 - Dry-run npm package publish"
	@echo "  npm-prerelease          - Publish prerelease npm packages"
	@echo "  npm-un-prerelease       - Unpublish prerelease npm packages"
	@echo
	@echo "Release:"
	@echo "  release                 - Create a new release version (opens PR creation URL)"
	@echo "  release-manually        - Create a new release version manually"
	@echo "  release-rollback        - Rollback a release version"
	@echo
	@echo "Tagging:"
	@echo "  tag-delete              - Delete a version tag"
	@echo
	@echo "For more details on each command, check the Makefile"

# Bundle

bundle:
	export PROD=true && .query/tasks/bundle.sh
	npx -p typescript tsc ./src/index.ts \
        --module NodeNext \
        --moduleResolution NodeNext \
        --declaration \
        --emitDeclarationOnly \
        --strict \
        --esModuleInterop \
        --skipLibCheck \
        --forceConsistentCasingInFileNames

# Changelog
# Install git cliff: https://git-cliff.org/docs/installation

changelog:
	@release_commit=$$(git log --grep="release: version" --format="%H" -n 1); \
	if [ -z "$$release_commit" ]; then \
		echo "Error: No 'release' commit found."; \
		exit 1; \
	fi; \
	last_commit=$$(git log --format="%H" -n 1); \
	git cliff $$release_commit..$$last_commit --tag $(ARGUMENTS) --prepend CHANGELOG.md; \
	echo "CHANGELOG.md has been updated with changes between commits:"; \
	echo "Last Commit: $$last_commit"; \
	echo "Previous Release Commit: $$release_commit"

# npm

npm-publish: bundle
	npm publish --access public

npm-dry: bundle
	npm publish --dry-run

npm-prerelease: bundle
	@if [ "$(findstring prerelease,$(ARGUMENTS))" = "prerelease" ]; then \
		npm publish --access public --tag prerelease-$(VERSION) ;\
	fi

npm-un-prerelease:
	@if [ "$(findstring prerelease,$(ARGUMENTS))" = "prerelease" ]; then \
		npm unpublish @qery/reative-component@$(ARGUMENTS) --force ;\
	fi

# Release

release:
	release_branch="release/$(ARGUMENTS)"; \
	if [ -z "$(ARGUMENTS)" ]; then \
		echo "Error: Version argument is required. Usage: make release <version>"; \
		exit 1; \
	fi; \
	if ! echo "$(ARGUMENTS)" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z-]+)?(\+[0-9A-Za-z-]+)?$$'; then \
		echo "Error: Invalid version format. Must be semver (e.g., 1.2.3, 1.2.3-beta)"; \
		exit 1; \
	fi; \
	if git rev-parse --verify "release/$(ARGUMENTS)" >/dev/null 2>&1; then \
		echo "Error: Release branch release/$(ARGUMENTS) already exists"; \
		exit 1; \
	fi; \
	if ! git checkout main; then \
		echo "Error: Failed to checkout main branch"; \
		exit 1; \
	fi; \
	if ! git pull --rebase origin main; then \
		echo "Error: Failed to pull latest changes from main"; \
		exit 1; \
	fi; \
	if ! git checkout -b $$release_branch; then \
		echo "Error: Failed to create release branch $$release_branch"; \
		exit 1; \
	fi; \
	node -e "const fs = require('fs'); const pkg = require('./package.json'); pkg.version = '$(ARGUMENTS)'; fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 4) + '\n')"
	git add package.json && \
		git commit -m "chore: update version to v$(ARGUMENTS)"
	git push --set-upstream origin $$release_branch

release-manually: bundle
	node -e "const fs = require('fs'); const pkg = require('./package.json'); pkg.version = '$(ARGUMENTS)'; fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 4) + '\n')"
	export PROD=true .query/tasks/bundle.sh
	make changelog $(ARGUMENTS)
	git add CHANGELOG.md
	git commit -m "release: version $(ARGUMENTS)"
	git push --force-with-lease
	git tag v$(ARGUMENTS)
	git push --tags

release-rollback:
	@read -p "Are you sure you want to rollback the tag version $(ARGUMENTS)? [Y/n] " REPLY; \
    if [ "$$REPLY" = "Y" ] || [ "$$REPLY" = "y" ] || [ "$$REPLY" = "" ]; then \
        git reset --soft HEAD~1; \
		git reset HEAD CHANGELOG.md; \
		git checkout -- CHANGELOG.md; \
		git tag -d v$(ARGUMENTS); \
		git push origin --delete v$(ARGUMENTS); \
		git push --force-with-lease; \
    else \
        echo "Aborted."; \
    fi

# Tag

tag-delete:
	@read -p "Are you sure you want to delete the tag version $(ARGUMENTS)? [Y/n] " REPLY; \
	if [ "$$REPLY" = "Y" ] || [ "$$REPLY" = "y" ] || [ "$$REPLY" = "" ]; then \
		git tag -d v$(ARGUMENTS); \
		git push origin --delete v$(ARGUMENTS); \
	else \
		echo "Aborted."; \
	fi

# catch anything and do nothing
%:
	@:
