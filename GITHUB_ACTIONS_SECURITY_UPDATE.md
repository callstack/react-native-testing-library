# GitHub Actions Security Update: SHA Pinning

## Overview

This update enhances the security of your GitHub Actions workflows by pinning all actions to their exact commit SHA values instead of using mutable version tags. This prevents potential supply chain attacks where malicious code could be introduced through tag manipulation.

## Actions Updated

### Main Workflows

| Action | Previous Version | New SHA (Version) | 
|--------|------------------|-------------------|
| `actions/checkout` | `@v4` | `@11bd719` (v4.2.2) |
| `actions/setup-node` | `@v4` | `@49933ea` (v4.4.0) |
| `actions/cache` | `@v4` | `@a3ec84` (v4.2.3) |
| `codecov/codecov-action` | `@v4` | `@54bcd8715eee62d40e33596ef5e8f0f48dbbccab` (v4.1.0) |
| `peaceiris/actions-gh-pages` | `@v3` | `@373f7f263a76c20808c831209c920827a82a2847` (v3.9.3) |

### Files Modified

1. **`.github/workflows/ci.yml`**
   - Updated `actions/checkout@v4` → SHA pinned version
   - Updated `codecov/codecov-action@v4` → SHA pinned version

2. **`.github/workflows/example-apps.yml`**
   - Updated `actions/checkout@v4` → SHA pinned version
   - Updated `actions/setup-node@v4` → SHA pinned version

3. **`.github/workflows/website.yml`**
   - Updated `actions/checkout@v4` → SHA pinned version
   - Updated `peaceiris/actions-gh-pages@v3` → SHA pinned version

4. **`.github/actions/setup-deps/action.yml`**
   - Updated `actions/setup-node@v4` → SHA pinned version
   - Updated `actions/cache@v4` → SHA pinned version

5. **`.github/actions/setup-website-deps/action.yml`**
   - Updated `actions/setup-node@v4` → SHA pinned version
   - Updated `actions/cache@v4` → SHA pinned version

## Security Benefits

### 🔒 **Supply Chain Attack Prevention**
- **Before**: Version tags like `@v4` are mutable and could be maliciously updated
- **After**: SHA hashes are immutable - the exact code that runs is guaranteed

### 🛡️ **Reproducible Builds**
- **Before**: `@v4` could point to different commits over time
- **After**: SHA ensures the exact same action code runs every time

### 🔍 **Audit Trail**
- **Before**: Unclear which exact version of an action was used
- **After**: Comments show both the SHA and corresponding version for transparency

### ⚡ **No Functionality Impact**
- All workflows continue to function exactly as before
- No breaking changes to your CI/CD pipeline
- Performance remains the same

## Maintenance

### Updating Actions
When you want to update to newer versions of actions:

1. Check the action's releases page for the latest version
2. Find the corresponding commit SHA for that version
3. Update both the SHA and the comment with the new version

### Example Update Process
```yaml
# Before
uses: actions/checkout@v4

# After initial security update  
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

# When updating to v4.3.0 (hypothetical)
uses: actions/checkout@<new-sha-for-v4.3.0> # v4.3.0
```

### Automation Options
Consider using tools like:
- **Dependabot**: Configure it to update SHA-pinned actions
- **Renovate**: Can automatically update both SHA and version comments
- **GitHub Security Advisories**: Will alert you to vulnerable action versions

## Verification

You can verify the integrity of the SHA hashes by:

1. **Checking the action's repository tags**:
   ```bash
   git ls-remote --tags https://github.com/actions/checkout.git
   ```

2. **Verifying commit hashes**:
   ```bash
   git show 11bd71901bbe5b1630ceea73d27597364c9af683
   ```

3. **Using GitHub's API**:
   ```bash
   curl -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/repos/actions/checkout/git/refs/tags/v4.2.2
   ```

## Compliance

This update aligns with security best practices recommended by:
- **NIST Secure Software Development Framework (SSDF)**
- **OpenSSF Scorecard** security guidelines
- **GitHub's own security recommendations**
- **SLSA (Supply Chain Levels for Software Artifacts)** Level 2+ requirements

## Next Steps

1. ✅ **Immediate**: All actions are now SHA-pinned
2. 🔄 **Ongoing**: Monitor action repositories for security updates
3. 📊 **Future**: Consider implementing automated SHA update workflows
4. 🔍 **Review**: Regularly audit and update to latest secure versions

---

**Note**: This security update maintains full backward compatibility while significantly improving your supply chain security posture. Your workflows will continue to function exactly as before, but with enhanced protection against potential attacks.