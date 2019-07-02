import 'document-register-element';
import 'classlist-polyfill';
import defineElement from './libs/define-element';

import MyExample1 from './components/my-example-1';
import MyExample2 from './components/my-example-2';
import MyExample2Child from './components/my-example-2-child';
import MyExample3 from './components/my-example-3';
import MyExample3Child from './components/my-example-3-child';
import MyExample4A from './components/my-example-4-a';
import MyExample4B from './components/my-example-4-b';
import MyExample5 from './components/my-example-5';

defineElement(MyExample1);
defineElement(MyExample2, [MyExample2Child]);
defineElement(MyExample3, [MyExample3Child]);
defineElement(MyExample4A);
defineElement(MyExample4B);
defineElement(MyExample5);
