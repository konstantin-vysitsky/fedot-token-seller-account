var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s2 = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s2 ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s2 && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name]() {
    return __privateGet(this, extra);
  }, set [name](x) {
    return __privateSet(this, extra, x);
  } }, name));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s2, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// packages/token-seller-account/src/index.ts
import { spawn } from "node:child_process";
import "@deepseek-ai/cordis";
import s from "@deepseek-ai/schemastery";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

// packages/token-seller-account/src/support.ts
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { getOrCreateAnonymousUserId } from "@deepseek-ai/dsh-anonymous-user-id";

// packages/token-seller-account/src/redact.ts
var REDACTED_KEY = "<key>";
var REDACTED_HOME = "<home>";
var REDACTED_EMAIL = "<email>";
var RULES = [
  // Заголовок авторизации целиком, вместе со схемой: `Authorization: Bearer sk-...`.
  { pattern: /\bAuthorization\s*[:=]\s*[^\s,;]+(?:\s+[^\s,;]+)?/giu, replacement: `Authorization: ${REDACTED_KEY}` },
  // Схема Bearer с любым значением.
  { pattern: /\bBearer\s+[A-Za-z0-9._~+/-]+=*/gu, replacement: `Bearer ${REDACTED_KEY}` },
  // Ключи вида `sk-...`.
  { pattern: /\bsk-[A-Za-z0-9_-]{4,}/gu, replacement: REDACTED_KEY },
  // Присваивания секретов: `TOKEN_SELLER_API_KEY=...`, `"api_key": "..."`, `PASSWORD: ...`.
  {
    pattern: /\b([A-Za-z0-9_]*(?:API_?KEY|TOKEN|SECRET|PASSWORD|PASSWD))["']?\s*[:=]\s*("[^"]*"|'[^']*'|\S+)/giu,
    replacement: `$1=${REDACTED_KEY}`
  },
  // Домашние каталоги Windows: `C:\Users\<имя>` и `C:/Users/<имя>`.
  { pattern: /(?<![\w.-])[A-Za-z]:[\\/]Users[\\/][^\\/\s"']+/gu, replacement: REDACTED_HOME },
  // Домашние каталоги Unix: `/home/<имя>` и `/Users/<имя>`.
  { pattern: /(?<![\w.-])\/(?:home|Users)\/[^/\s"')]+/gu, replacement: REDACTED_HOME },
  // Адреса почты.
  { pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/gu, replacement: REDACTED_EMAIL }
];
function redact(text) {
  let result = text;
  for (const rule of RULES) {
    result = result.replace(rule.pattern, rule.replacement);
  }
  return result;
}

// packages/token-seller-account/src/support.ts
var SUPPORT_REPORT_PATH = "/v1/support/report";
var REPORT_TIMEOUT_MS = 1e4;
var MAX_REPORTS_PER_PROCESS = 20;
var MAX_MESSAGE_LENGTH = 4e3;
var MAX_STACK_LENGTH = 2e4;
var MAX_DETAILS_BYTES = 64 * 1024;
var MAX_VERSION_LENGTH = 64;
var reportInFlight = false;
var reportAttempts = 0;
var cachedAppVersion;
function deviceCodeFromId(id) {
  const hex = createHash("sha256").update(id, "utf8").digest("hex").slice(0, 8).toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
}
function deviceCode() {
  return deviceCodeFromId(getOrCreateAnonymousUserId());
}
function appVersion() {
  if (cachedAppVersion !== void 0) return cachedAppVersion;
  cachedAppVersion = limit(readVersion("@deepseek-ai/dsh/package.json") ?? readVersion("../package.json") ?? "unknown", MAX_VERSION_LENGTH);
  return cachedAppVersion;
}
function readVersion(specifier) {
  try {
    const manifest = createRequire(import.meta.url)(specifier);
    const version = manifest.version;
    return typeof version === "string" && version !== "" ? version : void 0;
  } catch {
    return void 0;
  }
}
function limit(text, max) {
  return text.length <= max ? text : text.slice(0, max);
}
function buildReport(fields) {
  const payload = {
    device_code: deviceCode(),
    app_version: appVersion(),
    platform: process.platform,
    arch: process.arch,
    code: fields.code
  };
  const profile = process.env.DSH_PROFILE;
  if (profile !== void 0 && profile !== "") {
    payload.profile = profile;
  }
  const message = fields.message?.trim();
  if (message !== void 0 && message !== "") {
    payload.message = limit(redact(message), MAX_MESSAGE_LENGTH);
  }
  if (fields.stack !== void 0 && fields.stack !== "") {
    payload.stack = limit(redact(fields.stack), MAX_STACK_LENGTH);
  }
  if (fields.details !== void 0 && detailsFit(fields.details)) {
    payload.details = fields.details;
  }
  return payload;
}
function detailsFit(details) {
  try {
    return JSON.stringify(details).length <= MAX_DETAILS_BYTES;
  } catch {
    return false;
  }
}
async function sendReport(baseUrl, payload) {
  if (reportInFlight || reportAttempts >= MAX_REPORTS_PER_PROCESS) return false;
  reportInFlight = true;
  reportAttempts += 1;
  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/u, "")}${SUPPORT_REPORT_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REPORT_TIMEOUT_MS)
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    reportInFlight = false;
  }
}
async function reportProblem(baseUrl, note) {
  const code = deviceCode();
  try {
    const reported = await sendReport(baseUrl, buildReport({ code: "user-report", message: note }));
    return { reported, code };
  } catch {
    return { reported: false, code };
  }
}

// packages/token-seller-account/src/attribution.ts
var SESSION_HEADER = "x-deepseek-harness-session-id";
var PROJECT_HEADER = "x-token-seller-project";
var PENDING_TTL_MS = 3e4;
var MAX_CHATS = 256;
function targetsService(input, baseUrl) {
  const url = urlOf(input);
  if (url === void 0) return false;
  return url.startsWith(baseUrl);
}
function urlOf(input) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (typeof input === "object" && input !== null) {
    const referenced = input.url;
    if (typeof referenced === "string") return referenced;
  }
  return void 0;
}
function headersOf(input, init) {
  const fromInit = init !== null && typeof init === "object" ? init.headers : void 0;
  const candidate = fromInit ?? (input !== null && typeof input === "object" ? input.headers : void 0);
  if (candidate === void 0) return void 0;
  try {
    return new Headers(candidate);
  } catch {
    return void 0;
  }
}
function encodeProject(cwd) {
  return encodeURIComponent(cwd);
}
var Attribution = class {
  baseUrl;
  fetchCall;
  chats = /* @__PURE__ */ new Map();
  /**
   * @param baseUrl - адрес службы без завершающего слеша.
   * @param fetchCall - исходный `fetch`, который нужно вызывать.
   */
  constructor(baseUrl, fetchCall) {
    this.baseUrl = baseUrl;
    this.fetchCall = fetchCall;
  }
  /**
   * Запоминает каталог чата и отмечает начало его модельного вызова.
   *
   * Отметка нужна, потому что в `_fetch` нет идентификатора чата: его
   * приносит заголовок, который поставил харнесс. Метка связывает этот
   * заголовок с каталогом, который известен только из `agent/request`.
   * @param sessionId - идентификатор чата.
   * @param cwd - абсолютный рабочий каталог, если хост его сообщил.
   */
  noteCall(sessionId, cwd) {
    if (sessionId === "" || cwd === void 0 || cwd.trim() === "") return;
    const known = this.chats.get(sessionId);
    const now = Date.now();
    if (known === void 0) {
      this.evictIfNeeded();
      this.chats.set(sessionId, { cwd, pending: 1, startedAt: now });
      return;
    }
    known.pending += 1;
    known.startedAt = now;
  }
  /** Снимает одну метку вызова после того, как ответ начался. */
  settle(sessionId) {
    if (sessionId === null || sessionId === "") return;
    const known = this.chats.get(sessionId);
    if (known === void 0) return;
    known.pending -= 1;
    if (known.pending <= 0) this.chats.delete(sessionId);
  }
  /**
   * Каталог чата, которому сейчас отвечает служба.
   *
   * Один вызов за раз: модельные запросы ходят по одному на чат, но два
   * разных чата могут отвечать одновременно. Если метка видна у нескольких и
   * различить их нечем, ответ считается непригодным (ни один не получает
   * каталог) — приписать расход не той папке хуже, чем не приписать вовсе.
   * @returns каталог и чат, либо `undefined`, если связать не с чем.
   */
  liveChat() {
    const now = Date.now();
    let live;
    let ambiguous = false;
    for (const [sessionId, facts] of this.chats) {
      if (now - facts.startedAt > PENDING_TTL_MS) {
        this.chats.delete(sessionId);
        continue;
      }
      if (facts.pending <= 0) {
        this.chats.delete(sessionId);
        continue;
      }
      if (live === void 0) {
        live = { sessionId, cwd: facts.cwd };
        continue;
      }
      ambiguous = true;
    }
    return ambiguous ? void 0 : live;
  }
  /** Держит карту чатов ограниченной: удаляет самый старый. */
  evictIfNeeded() {
    while (this.chats.size >= MAX_CHATS) {
      const oldest = this.chats.keys().next();
      if (oldest.done === true) return;
      this.chats.delete(oldest.value);
    }
  }
  /**
   * Дополняет заголовки исходящего запроса тем, чего в них нет.
   *
   * Всё, что поставил харнесс, остаётся как есть: свой `session_id` у
   * встроенного маршрута не перезаписывается. Если харнесс уже сообщает сайт,
   * он тоже не трогается — значит, доставка уже работает, и вмешиваться нечем.
   *
   * @param input - первый аргумент `fetch`.
   * @param init - второй аргумент `fetch`.
   * @returns тот же `init`, если дополнить нечего; иначе новый.
   */
  adjust(input, init) {
    const headers = headersOf(input, init);
    if (headers === void 0) return init;
    if (headers.has(PROJECT_HEADER)) return init;
    const live = this.liveChat();
    if (live === void 0) return init;
    const next = headers;
    if (!next.has(SESSION_HEADER)) next.set(SESSION_HEADER, live.sessionId);
    next.set(PROJECT_HEADER, encodeProject(live.cwd));
    const base = init !== null && typeof init === "object" ? init : {};
    return { ...base, headers: next };
  }
};
function installAttribution(baseUrl) {
  const target = globalThis;
  if (typeof target.fetch !== "function") return void 0;
  if (target.__fedotTokenSellerAttribution === true) return void 0;
  const origin = target.fetch.bind(globalThis);
  const serviceUrl = baseUrl.replace(/\/$/, "");
  const attribution = new Attribution(serviceUrl, origin);
  const wrapper = async (input, init) => {
    if (!targetsService(input, `${serviceUrl}/`)) return origin(input, init);
    try {
      return await origin(input, attribution.adjust(input, init));
    } finally {
      attribution.settle(sessionOfRequest(input, init));
    }
  };
  target.fetch = wrapper;
  Object.defineProperty(target, "__fedotTokenSellerAttribution", {
    value: true,
    enumerable: false,
    configurable: true
  });
  return attribution;
}
function sessionOfRequest(input, init) {
  const headers = headersOf(input, init);
  return headers?.get(SESSION_HEADER) ?? null;
}
function watchModelCalls(ctx, attribution) {
  if (attribution === void 0) return;
  const withCwd = ctx;
  ctx.effect(
    () => withCwd.on("agent/request", (payload, next) => {
      try {
        const sessionId = payload.agent?.session?.id;
        const cwd = payload.agent?.session?.header?.cwd;
        if (typeof sessionId === "string") {
          attribution.noteCall(sessionId, typeof cwd === "string" ? cwd : void 0);
        }
      } catch {
      }
      return next();
    }),
    "token-seller-account: \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043E \u0447\u0430\u0442\u0435 \u0434\u043B\u044F \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 \u0440\u0430\u0441\u0445\u043E\u0434\u0430"
  );
}

// packages/token-seller-account/src/index.ts
var TOKEN_SELLER_API_KEY_REF = credentialRef("TOKEN_SELLER_API_KEY");
var TOKEN_SELLER_NAMESPACE = "tokenSellerAccount";
var DEFAULT_BASE_URL = "https://xn--80ahc1bui.xn--p1ai";
var REQUEST_TIMEOUT_MS = 15e3;
function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}
function isErrorLike(value) {
  return typeof value === "object" && value !== null && typeof value.code === "string";
}
function subscriptionErrorCode(message) {
  const text = (message ?? "").toLowerCase();
  if (text.includes("expired") || text.includes("\u0420\u0451\u0421\u0403\u0421\u201A\u0421\u2018\u0420\u0454")) return "subscription-expired";
  if (text.includes("limit") || text.includes("\u0420\xBB\u0420\u0451\u0420\u0458\u0420\u0451\u0421\u201A")) return "subscription-exhausted";
  return "subscription-required";
}
var BALANCE_AMOUNT_FIELDS = [
  "limit_usd",
  "spent_usd",
  "remaining_usd",
  "used_percent",
  "remaining_percent"
];
var USAGE_AMOUNT_FIELDS = ["cost_usd"];
var EXPENSE_TOTAL_AMOUNT_FIELDS = [
  "cost_usd",
  "cost_today_usd",
  "cost_week_usd",
  "cost_total_usd",
  // РЎС‚РѕРёРјРѕСЃС‚СЊ СЃРµСЂРІРµСЂРЅС‹С… РїРѕРёСЃРєРѕРІ РІ СЃРµС‚Рё: РѕРЅР° РІС…РѕРґРёС‚ РІ СЃСѓРјРјС‹ РІС‹С€Рµ, РЅРѕ
  // РїРѕРєР°Р·С‹РІР°РµС‚СЃСЏ РѕС‚РґРµР»СЊРЅРѕР№ СЃС‚СЂРѕРєРѕР№, РїРѕСЌС‚РѕРјСѓ С‚РѕР¶Рµ РїСЂРёС…РѕРґРёС‚ СЃС‚СЂРѕРєРѕР№.
  "search_cost_usd"
];
var EXPENSE_CALL_AMOUNT_FIELDS = ["cost_usd", "search_cost_usd"];
function withNumericAmounts(value, fields) {
  const source = value;
  const patch = {};
  for (const field of fields) {
    const raw = source[field];
    if (typeof raw !== "string" || raw.trim() === "") continue;
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) patch[field] = parsed;
  }
  return Object.keys(patch).length === 0 ? value : { ...value, ...patch };
}
var _expenses_dec, _registerSession_dec, _reportProblem_dec, _supportInfo_dec, _usage_dec, _balance_dec, _devicePoll_dec, _deviceStart_dec, _login_dec, _register_dec, _a, _init;
var TokenSellerAccountService = class extends (_a = TypertRemoteService, _register_dec = [Remote("register")], _login_dec = [Remote("login")], _deviceStart_dec = [Remote("deviceStart")], _devicePoll_dec = [Remote("devicePoll")], _balance_dec = [Remote("balance")], _usage_dec = [Remote("usage")], _supportInfo_dec = [Remote("supportInfo")], _reportProblem_dec = [Remote("reportProblem")], _registerSession_dec = [Remote("registerSession")], _expenses_dec = [Remote("expenses")], _a) {
  /**
   * @param ctx - РєРѕРЅС‚РµРєСЃС‚ РїР»Р°РіРёРЅР°; РґРѕР»Р¶РµРЅ РїСЂРµРґРѕСЃС‚Р°РІР»СЏС‚СЊ СЃР»СѓР¶Р±Сѓ `credentials`.
   * @param config - РЅР°СЃС‚СЂРѕР№РєРё РїР°РєРµС‚Р°.
   */
  constructor(ctx, config) {
    super(ctx, TOKEN_SELLER_NAMESPACE);
    __runInitializers(_init, 5, this);
    __publicField(this, "baseUrl");
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    ctx.effect(
      () => ctx.on("agent/error", ({ turn, step, error }) => {
        this.reportAgentError(turn, step, error);
      }),
      "token-seller-account: \u0420\u0455\u0421\u201A\u0421\u2021\u0421\u2018\u0421\u201A\u0421\u2039 \u0420\u0455 \u0421\u0403\u0420\xB1\u0420\u0455\u0421\u040F\u0421\u2026 \u0420\xB0\u0420\u0456\u0420\xB5\u0420\u0405\u0421\u201A\u0420\xB0"
    );
    const attribution = installAttribution(this.baseUrl);
    if (attribution === void 0) {
      ctx.logger.warn("token-seller-account: \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u043E\u0433\u043E fetch \u043D\u0435\u0442, \u0440\u0430\u0441\u0445\u043E\u0434 \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u043E\u0442\u043D\u0435\u0441\u0451\u043D \u043A \u043F\u0430\u043F\u043A\u0435");
    }
    watchModelCalls(ctx, attribution);
  }
  /**
   * РћС‚РїСЂР°РІР»СЏРµС‚ РѕС‚С‡С‘С‚ Рѕ СЃР±РѕРµ Р°РіРµРЅС‚Р°, СЃ РЅРѕРјРµСЂРѕРј С…РѕРґР° Рё С€Р°РіР°.
   * @param turn - РЅРѕРјРµСЂ С…РѕРґР°, РІ РєРѕС‚РѕСЂРѕРј СЃР»СѓС‡РёР»СЃСЏ СЃР±РѕР№.
   * @param step - РЅРѕРјРµСЂ С€Р°РіР° РІРЅСѓС‚СЂРё С…РѕРґР°.
   * @param error - Р±СЂРѕС€РµРЅРЅРѕРµ Р·РЅР°С‡РµРЅРёРµ.
   */
  reportAgentError(turn, step, error) {
    const payload = buildReport({
      code: "agent-error",
      message: messageOf(error),
      stack: error instanceof Error ? error.stack : void 0,
      details: { turn, step }
    });
    void sendReport(this.baseUrl, payload).catch(() => {
    });
  }
  async register(email, password) {
    return this.postJson("/v1/auth/register", { email, password });
  }
  async login(email, password) {
    return this.postJson("/v1/auth/login", { email, password });
  }
  async deviceStart() {
    const result = await this.postJson("/v1/device/start", {});
    if (!("code" in result)) {
      this.openBrowser(result.verify_url).catch((error) => {
        this.ctx.logger.warn("token-seller-account: \u0420\u0405\u0420\xB5 \u0421\u0453\u0420\u0491\u0420\xB0\u0420\xBB\u0420\u0455\u0421\u0403\u0421\u040A \u0420\u0455\u0421\u201A\u0420\u0454\u0421\u0402\u0421\u2039\u0421\u201A\u0421\u040A \u0420\xB1\u0421\u0402\u0420\xB0\u0421\u0453\u0420\xB7\u0420\xB5\u0421\u0402: %s", messageOf(error));
      });
    }
    return result;
  }
  async devicePoll(deviceCode2) {
    const query = new URLSearchParams({ device_code: deviceCode2 });
    return this.getJson(`/v1/device/poll?${query.toString()}`);
  }
  async balance() {
    const result = await this.withApiKey(async (apiKey) => this.getJson("/v1/balance", apiKey));
    return "status" in result ? withNumericAmounts(result, BALANCE_AMOUNT_FIELDS) : result;
  }
  async usage(opts) {
    const result = await this.withApiKey(async (apiKey) => {
      const query = new URLSearchParams({
        limit: String(opts.limit),
        offset: String(opts.offset)
      });
      return this.getJson(`/v1/usage?${query.toString()}`, apiKey);
    });
    if (!("data" in result)) return result;
    return {
      ...result,
      data: result.data.map((entry) => withNumericAmounts(entry, USAGE_AMOUNT_FIELDS))
    };
  }
  async supportInfo() {
    return { code: deviceCode(), vpnUrl: `${this.baseUrl}/vpn` };
  }
  async reportProblem(note) {
    return reportProblem(this.baseUrl, note);
  }
  async registerSession(sessionId, cwd, title) {
    return this.withApiKey(async (apiKey) => {
      const body = { session_id: sessionId, cwd };
      if (title !== void 0 && title.trim() !== "") body.title = title;
      return this.postJson("/v1/sessions", body, apiKey);
    });
  }
  async expenses(opts = {}) {
    const result = await this.withApiKey(async (apiKey) => {
      const body = {
        with_turns: opts.withTurns === true
      };
      if (opts.withTurns === true && opts.project !== void 0 && opts.project !== "") {
        body.project = opts.project;
      }
      return this.postJson("/v1/expenses", body, apiKey);
    });
    if (!("projects" in result)) return result;
    const totals = withNumericAmounts(result, EXPENSE_TOTAL_AMOUNT_FIELDS);
    return {
      ...totals,
      projects: totals.projects.map((project) => {
        const withProjectTotals = withNumericAmounts(project, EXPENSE_TOTAL_AMOUNT_FIELDS);
        return {
          ...withProjectTotals,
          turns: withProjectTotals.turns.map((turn) => ({
            ...withNumericAmounts(turn, EXPENSE_TOTAL_AMOUNT_FIELDS),
            // РњРёРєСЂРѕР·Р°РїСЂРѕСЃС‹ РЅРµСЃСѓС‚ СЃРІРѕСЋ РґРѕР»СЋ СЃС‚РѕРёРјРѕСЃС‚Рё РїРѕРёСЃРєРѕРІ, Рё РѕРЅР° С‚РѕР¶Рµ
            // РїСЂРёС…РѕРґРёС‚ СЃС‚СЂРѕРєРѕР№: РЅР°Р±РѕСЂ РґРµРЅРµР¶РЅС‹С… РїРѕР»РµР№ Сѓ РЅРёС… РґСЂСѓРіРѕР№.
            calls: turn.calls.map((call) => withNumericAmounts(call, EXPENSE_CALL_AMOUNT_FIELDS))
          }))
        };
      })
    };
  }
  /**
   * Р”РѕСЃС‚Р°С‘С‚ СЃРѕС…СЂР°РЅС‘РЅРЅС‹Р№ РєР»СЋС‡ РїРµСЂРµРґ Р·Р°РїСЂРѕСЃРѕРј, С‚СЂРµР±СѓСЋС‰РёРј Р°РІС‚РѕСЂРёР·Р°С†РёРё.
   * @param operation - Р·Р°РїСЂРѕСЃ, РєРѕС‚РѕСЂРѕРјСѓ РЅСѓР¶РµРЅ РєР»СЋС‡.
   * @returns СЂРµР·СѓР»СЊС‚Р°С‚ Р·Р°РїСЂРѕСЃР°, `{ code: 'not-connected' }` Р»РёР±Рѕ РѕС€РёР±РєСѓ РјРѕСЃС‚Р°.
   */
  async withApiKey(operation) {
    const credential = await this.ctx.credentials.resolve(TOKEN_SELLER_API_KEY_REF);
    if (credential === void 0) {
      return { code: "not-connected" };
    }
    return operation(credential.value);
  }
  /**
   * РћС‚РїСЂР°РІР»СЏРµС‚ JSON РјРµС‚РѕРґРѕРј POST.
   * @param path - РїСѓС‚СЊ РЅР° СЃРµСЂРІРёСЃРµ.
   * @param body - С‚РµР»Рѕ Р·Р°РїСЂРѕСЃР°.
   * @param apiKey - РєР»СЋС‡ РґРѕСЃС‚СѓРїР°, РµСЃР»Рё Р·Р°РїСЂРѕСЃ Р°РІС‚РѕСЂРёР·РѕРІР°РЅРЅС‹Р№.
   * @returns СЂР°Р·РѕР±СЂР°РЅРЅС‹Р№ РѕС‚РІРµС‚ Р»РёР±Рѕ РѕС€РёР±РєСѓ РјРѕСЃС‚Р°.
   */
  async postJson(path, body, apiKey) {
    return this.requestJson("POST", path, this.jsonHeaders(apiKey), JSON.stringify(body));
  }
  /**
   * Р§РёС‚Р°РµС‚ JSON РјРµС‚РѕРґРѕРј GET.
   * @param path - РїСѓС‚СЊ РЅР° СЃРµСЂРІРёСЃРµ.
   * @param apiKey - РєР»СЋС‡ РґРѕСЃС‚СѓРїР°, РµСЃР»Рё Р·Р°РїСЂРѕСЃ Р°РІС‚РѕСЂРёР·РѕРІР°РЅРЅС‹Р№.
   * @returns СЂР°Р·РѕР±СЂР°РЅРЅС‹Р№ РѕС‚РІРµС‚ Р»РёР±Рѕ РѕС€РёР±РєСѓ РјРѕСЃС‚Р°.
   */
  async getJson(path, apiKey) {
    return this.requestJson("GET", path, this.jsonHeaders(apiKey));
  }
  /**
   * Р’С‹РїРѕР»РЅСЏРµС‚ Р·Р°РїСЂРѕСЃ Рє СЃРµСЂРІРёСЃСѓ Рё РїСЂРµРІСЂР°С‰Р°РµС‚ СЃР±РѕР№ РІ РєРѕРґ РѕС€РёР±РєРё РјРѕСЃС‚Р°.
   *
   * Р›СЋР±РѕР№ СЃР±РѕР№ вЂ” РЅРµРґРѕСЃС‚СѓРїРЅС‹Р№ СЃРµСЂРІРёСЃ, С‚Р°Р№РјР°СѓС‚, РЅРµСѓСЃРїРµС€РЅС‹Р№ СЃС‚Р°С‚СѓСЃ вЂ” СѓС…РѕРґРёС‚
   * РѕС‚С‡С‘С‚РѕРј РЅР° СЃРµСЂРІРµСЂ РїРѕРґРґРµСЂР¶РєРё. РћС‚РїСЂР°РІРєР° РЅРµ Р¶РґС‘С‚СЃСЏ Рё РЅР° РѕС‚РІРµС‚ РЅРµ РІР»РёСЏРµС‚.
   * @param method - РјРµС‚РѕРґ HTTP.
   * @param path - РїСѓС‚СЊ РЅР° СЃРµСЂРІРёСЃРµ.
   * @param headers - Р·Р°РіРѕР»РѕРІРєРё Р·Р°РїСЂРѕСЃР°.
   * @param body - С‚РµР»Рѕ Р·Р°РїСЂРѕСЃР°; Сѓ GET РµРіРѕ РЅРµС‚.
   * @returns СЂР°Р·РѕР±СЂР°РЅРЅС‹Р№ РѕС‚РІРµС‚ Р»РёР±Рѕ РѕС€РёР±РєСѓ РјРѕСЃС‚Р°.
   */
  async requestJson(method, path, headers, body) {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        ...body === void 0 ? {} : { body },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });
      const result = await this.parseResponse(response);
      if (!response.ok && isErrorLike(result)) {
        this.reportFailure(method, path, response.status, result);
      }
      return result;
    } catch (error) {
      const failure = this.mapTransportError(error);
      this.reportFailure(method, path, null, failure, error);
      return failure;
    }
  }
  /**
   * РћС‚РїСЂР°РІР»СЏРµС‚ РѕС‚С‡С‘С‚ Рѕ СЃР±РѕРµ РѕР±СЂР°С‰РµРЅРёСЏ Рє СЃРµСЂРІРёСЃСѓ.
   *
   * Р’С‹Р·РѕРІ В«РІС‹СЃС‚СЂРµР»РёР» Рё Р·Р°Р±С‹Р»В»: РѕС‚РІРµС‚ РїРѕР»СЊР·РѕРІР°С‚РµР»СЋ РЅРµ Р¶РґС‘С‚ РѕС‚РїСЂР°РІРєРё, Р° СЃР±РѕР№
   * СЃР°РјРѕРіРѕ РѕС‚С‡С‘С‚Р° С‚РѕР»СЊРєРѕ РїРёС€РµС‚СЃСЏ РІ Р¶СѓСЂРЅР°Р» вЂ” Р±РµР· С‚РµРєСЃС‚Р° РѕС‚С‡С‘С‚Р°, РїРѕС‚РѕРјСѓ С‡С‚Рѕ РІ РЅС‘Рј
   * РјРѕР¶РµС‚ Р±С‹С‚СЊ С‡СѓР¶Р°СЏ С„РѕСЂРјСѓР»РёСЂРѕРІРєР°.
   * @param method - РјРµС‚РѕРґ HTTP.
   * @param path - РїСѓС‚СЊ РЅР° СЃРµСЂРІРёСЃРµ.
   * @param status - СЃС‚Р°С‚СѓСЃ РѕС‚РІРµС‚Р°; null РїСЂРё С‚СЂР°РЅСЃРїРѕСЂС‚РЅРѕР№ РѕС€РёР±РєРµ.
   * @param failure - РѕС€РёР±РєР° РјРѕСЃС‚Р° СЃ РєРѕРґРѕРј Рё С‚РµРєСЃС‚РѕРј СЃРµСЂРІРёСЃР°.
   * @param cause - РёСЃС…РѕРґРЅРѕРµ РёСЃРєР»СЋС‡РµРЅРёРµ, РµСЃР»Рё РѕРЅРѕ Р±С‹Р»Рѕ: РёР· РЅРµРіРѕ Р±РµСЂС‘С‚СЃСЏ СЃС‚РµРє.
   */
  reportFailure(method, path, status, failure, cause) {
    const payload = buildReport({
      code: failure.code,
      message: failure.message,
      stack: cause instanceof Error ? cause.stack : void 0,
      details: { path, method, status }
    });
    void sendReport(this.baseUrl, payload).then((sent) => {
      if (!sent) {
        this.ctx.logger.warn("token-seller-account: \u0420\u0455\u0421\u201A\u0421\u2021\u0421\u2018\u0421\u201A \u0420\u0455 \u0421\u0403\u0420\xB1\u0420\u0455\u0420\xB5 \u0420\u0405\u0420\xB5 \u0420\u0455\u0421\u201A\u0420\u0457\u0421\u0402\u0420\xB0\u0420\u0406\u0420\xBB\u0420\xB5\u0420\u0405: %s", payload.code);
      }
    }).catch(() => {
    });
  }
  /** Р—Р°РіРѕР»РѕРІРєРё Р·Р°РїСЂРѕСЃР°, РїСЂРё РЅРµРѕР±С…РѕРґРёРјРѕСЃС‚Рё СЃ РєР»СЋС‡РѕРј РґРѕСЃС‚СѓРїР°. */
  jsonHeaders(apiKey) {
    const headers = { "Content-Type": "application/json" };
    if (apiKey !== void 0) {
      headers.Authorization = `Bearer ${apiKey}`;
    }
    return headers;
  }
  /** Р Р°Р·Р±РёСЂР°РµС‚ РѕС‚РІРµС‚, РїСЂРµРІСЂР°С‰Р°СЏ РЅРµСѓСЃРїРµС€РЅС‹Р№ СЃС‚Р°С‚СѓСЃ РІ РєРѕРґ РѕС€РёР±РєРё РјРѕСЃС‚Р°. */
  async parseResponse(response) {
    let body;
    try {
      body = await response.json();
    } catch {
      body = void 0;
    }
    if (!response.ok) {
      if (isErrorLike(body)) {
        return body;
      }
      return this.mapHttpStatus(response, body);
    }
    return body;
  }
  /**
   * РџРµСЂРµРІРѕРґРёС‚ HTTP-СЃС‚Р°С‚СѓСЃ Рё С‚РµР»Рѕ `{"detail": ...}` РІ СЃР»РѕРІР°СЂСЊ РѕС€РёР±РѕРє РјРѕСЃС‚Р°,
   * С‡С‚РѕР±С‹ РїР°РЅРµР»СЊ Р»РѕРєР°Р»РёР·РѕРІР°Р»Р° РїРѕ РєРѕРґСѓ, Р° РЅРµ РїРѕ С‚РµРєСЃС‚Сѓ СЃРµСЂРІРёСЃР°.
   * @param response - РѕС‚РІРµС‚ СЃРµСЂРІРёСЃР°.
   * @param body - СЂР°Р·РѕР±СЂР°РЅРЅРѕРµ С‚РµР»Рѕ РѕС‚РІРµС‚Р°.
   * @returns РѕС€РёР±РєР° РјРѕСЃС‚Р°.
   */
  mapHttpStatus(response, body) {
    const detail = typeof body === "object" && body !== null ? body.detail : void 0;
    const message = typeof detail === "string" && detail.length > 0 ? detail : void 0;
    const withMessage = (code) => message === void 0 ? { code } : { code, message };
    if (response.status === 400) return withMessage("invalid-credentials");
    if (response.status === 401) return withMessage("invalid-key");
    if (response.status === 402) return { code: subscriptionErrorCode(message), ...message === void 0 ? {} : { message } };
    if (response.status === 403) return withMessage("account-blocked");
    if (response.status === 404) return withMessage("project-not-found");
    if (response.status === 409) return withMessage("email-taken");
    if (response.status === 429) {
      const retryAfter = this.retryAfterSeconds(response);
      const limited = withMessage("rate-limited");
      return retryAfter === void 0 ? limited : { ...limited, retryAfter };
    }
    if (response.status >= 500) return withMessage("server-error");
    return {
      code: "request-failed",
      message: message ?? `Token Seller \u0420\u0406\u0420\xB5\u0421\u0402\u0420\u0405\u0421\u0453\u0420\xBB HTTP ${response.status}`
    };
  }
  /** Р§РёС‚Р°РµС‚ С†РµР»РѕРµ С‡РёСЃР»Рѕ СЃРµРєСѓРЅРґ РёР· Р·Р°РіРѕР»РѕРІРєР° `Retry-After`, РµСЃР»Рё РѕРЅ РµСЃС‚СЊ. */
  retryAfterSeconds(response) {
    const raw = response.headers.get("retry-after");
    if (raw === null) return void 0;
    const seconds = Number.parseInt(raw, 10);
    return Number.isFinite(seconds) && seconds > 0 ? seconds : void 0;
  }
  /** РћС‚Р»РёС‡Р°РµС‚ С‚Р°Р№РјР°СѓС‚ Р·Р°РїСЂРѕСЃР° РѕС‚ РЅРµРґРѕСЃС‚СѓРїРЅРѕРіРѕ СЃРµСЂРІРёСЃР°. */
  mapTransportError(error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return { code: "timeout", message: messageOf(error) };
    }
    return { code: "network-unreachable", message: messageOf(error) };
  }
  /**
   * РџС‹С‚Р°РµС‚СЃСЏ РѕС‚РєСЂС‹С‚СЊ Р°РґСЂРµСЃ РІ СЃРёСЃС‚РµРјРЅРѕРј Р±СЂР°СѓР·РµСЂРµ.
   * @param url - Р°РґСЂРµСЃ РїСЂРѕРІРµСЂРєРё РєРѕРґР° СѓСЃС‚СЂРѕР№СЃС‚РІР°.
   * @returns Р·Р°РІРµСЂС€РµРЅРёРµ РїРѕРїС‹С‚РєРё; РѕС€РёР±РєР° РЅРµ РїСЂРµСЂС‹РІР°РµС‚ Р°РІС‚РѕСЂРёР·Р°С†РёСЋ.
   */
  openBrowser(url) {
    const command = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
    return new Promise((resolve, reject) => {
      const child = spawn(command, [url], {
        shell: command === "start",
        stdio: "ignore",
        detached: true
      });
      child.on("error", reject);
      child.on("spawn", () => {
        child.unref();
        resolve();
      });
      child.on("close", (code) => {
        if (code !== 0 && code !== null) {
          reject(new Error(`\u0420\u0455\u0421\u201A\u0420\u0454\u0421\u0402\u0421\u2039\u0421\u201A\u0420\u0451\u0420\xB5 \u0420\xB1\u0421\u0402\u0420\xB0\u0421\u0453\u0420\xB7\u0420\xB5\u0421\u0402\u0420\xB0 \u0420\xB7\u0420\xB0\u0420\u0406\u0420\xB5\u0421\u0402\u0421\u20AC\u0420\u0451\u0420\xBB\u0420\u0455\u0421\u0403\u0421\u040A \u0420\u0454\u0420\u0455\u0420\u0491\u0420\u0455\u0420\u0458 ${code}`));
        } else {
          resolve();
        }
      });
    });
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "register", _register_dec, TokenSellerAccountService);
__decorateElement(_init, 1, "login", _login_dec, TokenSellerAccountService);
__decorateElement(_init, 1, "deviceStart", _deviceStart_dec, TokenSellerAccountService);
__decorateElement(_init, 1, "devicePoll", _devicePoll_dec, TokenSellerAccountService);
__decorateElement(_init, 1, "balance", _balance_dec, TokenSellerAccountService);
__decorateElement(_init, 1, "usage", _usage_dec, TokenSellerAccountService);
__decorateElement(_init, 1, "supportInfo", _supportInfo_dec, TokenSellerAccountService);
__decorateElement(_init, 1, "reportProblem", _reportProblem_dec, TokenSellerAccountService);
__decorateElement(_init, 1, "registerSession", _registerSession_dec, TokenSellerAccountService);
__decorateElement(_init, 1, "expenses", _expenses_dec, TokenSellerAccountService);
__decoratorMetadata(_init, TokenSellerAccountService);
__publicField(TokenSellerAccountService, "inject", ["credentials"]);
__publicField(TokenSellerAccountService, "Config", s.object({
  baseUrl: s.string().default(DEFAULT_BASE_URL)
}));
var index_default = TokenSellerAccountService;
export {
  TOKEN_SELLER_API_KEY_REF,
  TOKEN_SELLER_NAMESPACE,
  TokenSellerAccountService,
  index_default as default,
  deviceCodeFromId
};
//# sourceMappingURL=index.js.map
