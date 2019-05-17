import 'document-register-element';
import 'classlist-polyfill';
import defineElement from './libs/define-element';

import MySelect from './components/my-select';
import MyOption from './components/my-option';

defineElement(MySelect, [MyOption]);
