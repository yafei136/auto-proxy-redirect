try {
  importScripts('./js/constants.js');
} catch (error) {
  console.error(error);
}

let enabledSites = [];
let redirectMode = "";
let proxyUrl = "";

// Get the enabled sites
extensionApi.storage.sync.get({
  redirectMode: "",
  proxyUrl: "",
  sites: {},
  customSites: [],
}, function (items) {
  enabledSites = Object.values(items.sites).concat(items.customSites);
  redirectMode = items.redirectMode;
  proxyUrl = items.proxyUrl;
  updateRule()
});

// Listen for changes to options
extensionApi.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.sites || changes.proxyUrl || changes.redirectMode) {
    if (changes.sites) {
      const sites = changes.sites.newValue;
      enabledSites = Object.values(sites);
    }
    if (changes.redirectMode) {
      redirectMode = changes.redirectMode.newValue;
    }
    if (changes.proxyUrl) {
    proxyUrl = changes.proxyUrl.newValue;
    }
    updateRule()
    console.log(redirectMode)
  }
});

// Set and show default options on install
extensionApi.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
          console.error(error);
      }
      // do something more
  });
  chrome.storage.sync.clear();
    setDefaultOptions();
  } else if (details.reason === 'update') {
    // User updated extension
  }
});

function updateRule() {
    // remove previous rules
    chrome.declarativeNetRequest.getDynamicRules(previousRules => {
      const previousRuleIds = previousRules.map(rule => rule.id);
      chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: previousRuleIds, addRules: [] });
    });
  if (redirectMode == "0") {
    console.log("a");
    enabledSites.forEach((domain, index) => {
      let id = index + 1;
      var splited_host = domain.split(".");
      let len_host = splited_host.length;
      var regexSub = proxyUrl + "\\0";
      console.log(regexSub);
      var regexFilt = "^(https|http)://"; 

      for (let i = 1; i < len_host; i++) {
        regexFilt += splited_host[i - 1] + "\\."
      };
      regexFilt += splited_host[len_host-1];

      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: id,
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                regexSubstitution: regexSub
              }
            },
            condition: {
              regexFilter: regexFilt,
              resourceTypes: ["main_frame"]
            }
          },
        ],
        removeRuleIds: [id],
      });
    });
  } else if (redirectMode == "1") {
    enabledSites.forEach((domain, index) => {
      let id = index + 1;
      var splited_host = domain.split(".");
      let len_host = splited_host.length;

      var regexSub = "https://";
      var regexFilt = "^https://";
      for (let i = 1; i < len_host; i++) {
        regexSub += "\\" + (i).toString() + "-"
        regexFilt += "(" + splited_host[i - 1] + ")\\."
      };
      regexSub += "\\" + (len_host).toString();
      regexSub += "." + proxyUrl;
      regexFilt += "(" + splited_host[len_host - 1] + ")";

      console.log(regexFilt);
      console.log(regexSub)

      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: id,
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                regexSubstitution: regexSub
              }
            },
            condition: {
              regexFilter: regexFilt,
              resourceTypes: ["main_frame"]
            }
          },
        ],
        removeRuleIds: [id],
      });
      
    });
  }
}

function setDefaultOptions() {
  extensionApi.storage.sync.set({
    sites: defaultSites
  }, function () {
    extensionApi.runtime.openOptionsPage();
  });
}

