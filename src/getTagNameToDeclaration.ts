import { Declaration, CustomElementDeclaration, CustomElement, Package, ClassDeclaration, ClassField, ClassMethod } from '../node_modules/custom-elements-manifest/schema.d.js';
import {countTypes} from './countTypes';
import {getUnevaluatedNonStaticPublicFieldsFromDeclaration} from './getUnevaluatedNonStaticPublicFieldsFromDeclaration';
import { FlattenedCustomElementDeclaration } from './types.js';

export function getTagNameToDeclaration(fetchResult: any){
    const tagNameToDeclaration: {[key: string]: FlattenedCustomElementDeclaration} = {};
    const pack = fetchResult as Package;
    if(pack === undefined) return;
    const mods = pack.modules;
    if(mods === undefined) tagNameToDeclaration;
    
    for(const mod of mods){
        const declarations = mod.declarations;
        if(declarations === undefined) continue;
        const tagDeclarations = declarations.filter(x => (x as CustomElement).tagName !== undefined);
        
        for(const declaration of tagDeclarations){
            const ce = declaration as FlattenedCustomElementDeclaration;
            
            const tagName = (declaration as CustomElement).tagName!;
            
            
            if(tagName === undefined) continue;
            if(tagNameToDeclaration[tagName] !== undefined){
                if(countTypes(declaration) >  countTypes(tagNameToDeclaration[tagName] as Declaration)){
                    tagNameToDeclaration[tagName] = ce;
                }
            }else{
                tagNameToDeclaration[tagName] = ce;
            }
            ce.unevaluatedNonStaticPublicFields = getUnevaluatedNonStaticPublicFieldsFromDeclaration(ce);
            ce.methods = getMethodsFromDeclaration(ce);
            ce.path = mod.path;
        }
  
    }
    const declarations = Object.values(tagNameToDeclaration) as Declaration[];
    return {tagNameToDeclaration, declarations};  
  }



  function getMethodsFromDeclaration(ce: CustomElementDeclaration): ClassMethod[]{
    if(ce === undefined || ce.members === undefined) return [];
    return ce.members.filter(x => x.kind === 'method') as ClassMethod[];
  }