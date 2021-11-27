import { Declaration, CustomElementDeclaration, CustomElement, Package, ClassDeclaration, ClassField, ClassMethod } from '../node_modules/custom-elements-manifest/schema.d.js';

export  function getUnevaluatedNonStaticPublicFieldsFromDeclaration(ce: CustomElementDeclaration){
    if(ce === undefined || ce.members === undefined) return [];
    return ce.members.filter(x=> x.kind ==='field' && !x.static && !(x.privacy==='private')) as ClassField[];
}