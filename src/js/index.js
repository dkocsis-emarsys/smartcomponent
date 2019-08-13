import 'document-register-element';
import 'classlist-polyfill';
import defineElement from './libs/define-element';

import MyExample1 from './components/my-example-1';
import MyExample2 from './components/my-example-2';
import MyExample2Child from './components/my-example-2-child';
import MyExample3 from './components/my-example-3';

defineElement(MyExample1);
defineElement(MyExample2, [MyExample2Child]);
defineElement(MyExample3);