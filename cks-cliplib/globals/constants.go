package globals

// const LOG_DIR_PATH = "logs"
// const LOG_FILE_NAME = "/app.log"

const RecipePathKey = "CKS_ENV_RECIPE_PATH"
const RecipeDirectory = "__DEV_3"
const TEMPLATES_DIRNAME = "_templates"

const QUOTE = "\""

const RECIPE = "RECIPE"
const PHASE = "phase"
const ALTER = "alter"
const SPECIAL_DIR_PREFIX_ = "__"
const RECIPE_ROOT_DIR_ = SPECIAL_DIR_PREFIX_ + RECIPE
const ALTER_ROOT_DIR_ = SPECIAL_DIR_PREFIX_ + ALTER

const BLUEPRINTS = "BLUEPRINTS"
const MISC = "MISC"
const PHASES = "PHASES"
const CODE = "CODE"
const CONTEXT = "CONTEXT"
const DEPENDS_ON = "DEPENDS_ON"
const CODE_BLOCK = "CODE_BLOCK"
const QUERY = "QUERY"

const RECIPE_DIRNAME = SPECIAL_DIR_PREFIX_ + RECIPE
const BLUEPRINTS_DIRNAME = SPECIAL_DIR_PREFIX_ + BLUEPRINTS
const MISC_DIRNAME = SPECIAL_DIR_PREFIX_ + MISC
const PHASES_DIRNAME = SPECIAL_DIR_PREFIX_ + PHASES
const CODE_DIRNAME = SPECIAL_DIR_PREFIX_ + CODE
const CONTEXT_DIRNAME = SPECIAL_DIR_PREFIX_ + CONTEXT
const DEPENDS_ON_DIRNAME = SPECIAL_DIR_PREFIX_ + DEPENDS_ON
const CODE_BLOCK_ = SPECIAL_DIR_PREFIX_ + CODE_BLOCK
const QUERY_DIRNAME = SPECIAL_DIR_PREFIX_ + QUERY

const RUN_PY = "run.py"
const JSON_EXT = ".json"
const DIRECTIVES_lc = "directives"
const DIRECTIVES_JSON = DIRECTIVES_lc + JSON_EXT
const RECIPE_LOCATOR = "recipe_locator.json"
const KEY_TARGET_APP_NAME = "{{target}}"
const KEY_PHASE_NAME = "{{phase-name}}"
const KEY_CODE_BLOCK_NAME = "{{code-block-name}}"
const KEY_MOVE_ITEMS = "{{move-items}}"
const KEY_RECIPE_PATH = "{{recipe-path}}"
const KEY_LAST_PHASE = "{{last-phase}}"
const KEY_DEPENDS_ON_PHASE = "{{depends-on-phase}}"
const KEY_ALTER_NAME = "{{alter-name}}"
const KEY_ALTER_REL_PATH = "{{alter-rel-path}}"
const KEY_FORCE = "{{force}}"
const KEY_ALTER_PATH = "{{alter-path}}"
const KEY_BLUEPRINTS_PATH = "{{blueprints-path}}"
const KEY_CODE_BLOCK_ROOT_PATH = "{{code-block-root-path}}"
const KEY_CODE_BLOCK_PATH = "{{code-block-path}}"
const KEY_PHASES_PATH = "{{phases-path}}"
const KEY_FULL_ALTER_REL_PATH = "{{full-alter-rel-path}}"
const KEY_STORE_DIR_PATH = "{{store-dir-path}}"
const KEY_CONTROL_JSON_PATH = "{{control-json-path}}"
const KEY_TOKEN_FILE_NAME = "{{token-file-name}}"
const KEY_SRC_APP_PATH = "{{src-app-path}}"
const KEY_ALTER_SUB_COMMAND = "{{alter-sub-command}}"
const KEY_RECIPE_CONTAINER_PATH = "{{recipe-container-path}}"
const KEY_TARGET_PATH = "{{target-path}}"
const KEY_STORE_PATH = "{{store-path}}"
const KEY_FIRST_WORD_IN_FIRST_FILE = "{{first-word-in-first-file}}"

const CONTROL_JSON_FILE = "control.json"
const STORE_lc = "store"
const STORE_DIRNAME = SPECIAL_DIR_PREFIX_ + STORE_lc

const OPS_PIPELINE = "ops_pipeline"

const RECAST = "recast"
const PICK = "pick"
const TRANSFORM = "transform"
