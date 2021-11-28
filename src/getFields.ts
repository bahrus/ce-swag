import { Declaration, CustomElementDeclaration, CustomElement, Package, ClassDeclaration, ClassField, ClassMethod } from '../node_modules/custom-elements-manifest/schema.d.js';
import {getUnevaluatedNonStaticPublicFieldsFromDeclaration} from './getUnevaluatedNonStaticPublicFieldsFromDeclaration';
import { EnhancedClassField } from './types.js';


export function getFields(tagNameToDeclaration:  {[key: string]: CustomElementDeclaration}, tag: string){
    const ce = tagNameToDeclaration[tag!] as CustomElementDeclaration;
    const customElement = ce as unknown as CustomElement;
    if(ce === undefined || ce.members === undefined) return;
    const unevaluatedFields = getUnevaluatedNonStaticPublicFieldsFromDeclaration(ce);
  
    const fields = unevaluatedFields.map(field => {
        if(field.default !== undefined){
            let val = field.default;
            if(field.type !== undefined && field.type.text !== undefined){
                switch(field.type.text){
                    case 'boolean':
                    case 'number':
                        val = JSON.parse(val);
                        break;
                    case 'string':
                    case 'object':
                        try{
                            val = eval('(' + val + ')'); //yikes
                        }catch(e){
                          console.warn('Could not parse ' + val)
                        }
                        
                        break;
                }
            }
            return {
                ...field,
                val: val,
            };
        }else{
            return {
                ...field
            } as unknown as EnhancedClassField;
        }            
    });
    return {fields, customElement};
  }