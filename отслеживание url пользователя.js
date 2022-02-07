
function preRenderFn(widget, recoms, renderFn) {
    var subDomains = ['spb.pm.ru','krasnodar.pm.ru','tula.pm.ru','ryazan.pm.ru','kaluga.pm.ru','velikij-novgorod.pm.ru','nn.pm.ru','voronezh.pm.ru','tver.pm.ru','yaroslavl.pm.ru','vladimir.pm.ru','kostroma.pm.ru','lipetsk.pm.ru','ivanovo.pm.ru','novorossiysk.pm.ru','orel.pm.ru','rostov-na-donu.pm.ru'];
    var mainDomain = 'pm.ru';
    var pageUrl = window.location.href;

    subDomains.some(function(subDomain){
    if (pageUrl.indexOf(subDomain) >= 0) {
        filteredRecoms.forEach(function(recom) {
        recom.Url = recom.Url.replace(mainDomain, subDomain);
        });

        return true;
    }
    return false;
    });
}

