/* eslint-env es6 */

(function () {
  return function (include, options) {
    return (module, path = 'modules') => {
      let code;

      try {
        code = include(
          `./${path}/${module.type}.ejs`,
          Object.assign({ options }, { model: module.data || {} })
        );
      } catch (e) {
        throw new Error(`Module "${module.type}" has errors: ${e.message}`);
      }

      return `<!-- Module: ${module.name || ''} -->
        ${module.canShow ? `{% if ${module.canShow} %}` : ''}
        ${code}
        ${module.canShow ? '{% endif %}' : ''}
        <!-- Module End: ${module.name || ''} -->`;
    };
  };
}());

/*
in template 

global.module = eval(include('./js/module.js'))(include, options);
*/

/*
Setup

<@-module({
  type: 'MODULE_NAME',
  data: {},
  name: 'MODULE_NAME'
});@>

*/
