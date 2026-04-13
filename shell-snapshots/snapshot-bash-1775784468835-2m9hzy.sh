# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
shopt -s expand_aliases
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  function rg {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)
  if [[ ! -x $_cc_bin ]]; then command rg "$@"; return; fi
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=rg "$_cc_bin" "$@"
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    ARGV0=rg "$_cc_bin" "$@"
  elif [[ $BASHPID != $$ ]]; then
    exec -a rg "$_cc_bin" "$@"
  else
    (exec -a rg "$_cc_bin" "$@")
  fi
}
fi
export PATH='/c/Users/hara/bin:/mingw64/bin:/usr/local/bin:/usr/bin:/bin:/mingw64/bin:/usr/bin:/c/Users/hara/bin:/c/WINDOWS/system32:/c/WINDOWS:/c/WINDOWS/System32/Wbem:/c/WINDOWS/System32/WindowsPowerShell/v1.0:/c/WINDOWS/System32/OpenSSH:/cmd:/c/Program Files/nodejs:/c/Users/hara/AppData/Local/Microsoft/WindowsApps:/c/Users/hara/AppData/Roaming/npm:/c/Program Files/nodejs:/mingw64/bin:/usr/bin/vendor_perl:/usr/bin/core_perl:/c/Users/hara/AppData/Roaming/Claude/local-agent-mode-sessions/skills-plugin/5e060ee8-695d-448f-add0-6c26b5c8615d/76d3cadb-469e-480a-9bab-c45fd96cfb47/bin:/c/Users/hara/AppData/Roaming/Claude/local-agent-mode-sessions/76d3cadb-469e-480a-9bab-c45fd96cfb47/5e060ee8-695d-448f-add0-6c26b5c8615d/rpm/plugin_01TjMWsFwEhyPd7vQNJ5cqSg/bin'
