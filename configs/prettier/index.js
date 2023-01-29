module.exports = {
    printWidth: 120,
    tabWidth: 4,
    importOrder: ["<THIRD_PARTY_MODULES>", "^@atlasacademy/(.*)$", "^[./].*(?<!css)$", "(.*).css$", "^[./]"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderGroupNamespaceSpecifiers: true,
    importOrderCaseInsensitive: false,
    plugins: [require("@trivago/prettier-plugin-sort-imports")],
};
