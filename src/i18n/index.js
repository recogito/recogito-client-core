import * as Polyglot from 'node-polyglot';

const i18n = new Polyglot({ allowMissing: true });

i18n.init = lang => {
  i18n.locale(lang);
  i18n.extend(require(`./messages_${lang}.json`));
}

export default i18n;