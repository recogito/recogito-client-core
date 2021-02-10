import * as Polyglot from 'node-polyglot';
import * as timeago from 'timeago.js';

const i18n = new Polyglot({ allowMissing: true });

i18n.init = lang => {
  i18n.locale(lang);
  i18n.extend(require(`./messages_${lang}.json`));
}

/** Load and register TimeAgo locales **/
import ar from 'timeago.js/lib/lang/ar';
import cs from 'timeago.js/lib/lang/cs';
import de from 'timeago.js/lib/lang/de';
import es from 'timeago.js/lib/lang/es';
import gl from 'timeago.js/lib/lang/gl';
import hi from 'timeago.js/lib/lang/hi_IN';
import it from 'timeago.js/lib/lang/it';
import nl from 'timeago.js/lib/lang/nl';
import pt from 'timeago.js/lib/lang/pt_BR';
import sv from 'timeago.js/lib/lang/sv';
import tr from 'timeago.js/lib/lang/tr';

import bg from 'timeago.js/lib/lang/bg';
import bs from 'timeago.js/lib/lang/bs';
import el from 'timeago.js/lib/lang/el';
import fi from 'timeago.js/lib/lang/fi';
import fr from 'timeago.js/lib/lang/fr';
import hr from 'timeago.js/lib/lang/hr';
import hu from 'timeago.js/lib/lang/hu';
import ja from 'timeago.js/lib/lang/ja';
import ka from 'timeago.js/lib/lang/ka';
import ko from 'timeago.js/lib/lang/ko';
import lv from 'timeago.js/lib/lang/lv';
import nb from 'timeago.js/lib/lang/nb';
import pl from 'timeago.js/lib/lang/pl';
import ro from 'timeago.js/lib/lang/ro';
import ru from 'timeago.js/lib/lang/ru';
import sk from 'timeago.js/lib/lang/sk';
import sl from 'timeago.js/lib/lang/sl';
import sr from 'timeago.js/lib/lang/sr';
import th from 'timeago.js/lib/lang/th';
import tl from 'timeago.js/lib/lang/tl';
import uk from 'timeago.js/lib/lang/uk';
import vi from 'timeago.js/lib/lang/vi';
import zh from 'timeago.js/lib/lang/zh';

// import ur from 'timeago.js/lib/lang/ur'; // Not currently supported by TimeAgo

timeago.register('ar', ar);
timeago.register('cs', cs);
timeago.register('de', de);
timeago.register('es', es);
timeago.register('gl', gl);
timeago.register('hi', hi);
timeago.register('it', it);
timeago.register('nl', nl);
timeago.register('pt', pt);
timeago.register('sv', sv);
timeago.register('tr', tr);

timeago.register('bg',bg);
timeago.register('bs',bs);  // translation missing
timeago.register('el',el);
timeago.register('fi',fi);
timeago.register('fr',fr);
timeago.register('hr',hr); // translation missing
timeago.register('hu',hu);
timeago.register('ja',ja);
timeago.register('ka',ka);
timeago.register('ko',ko);
timeago.register('lv',lv); // translation missing
timeago.register('nb',nb); // translation missing
timeago.register('pl',pl);
timeago.register('ro',ro);
timeago.register('ru',ru);
timeago.register('sk',sk); // translation missing
timeago.register('sl',sl); // translation missing
timeago.register('sr',sr);
timeago.register('th',th);
timeago.register('tl',tl); // translation missing
timeago.register('uk',uk);
timeago.register('vi',vi);
timeago.register('zh',zh); // translation missing

export default i18n;
