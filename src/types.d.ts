import { Declaration, CustomElementDeclaration, CustomElement, Package, ClassDeclaration, ClassField, ClassMethod } from '../node_modules/custom-elements-manifest/schema.d.js';

export interface EnhancedClassField extends ClassField{
    val: any;
}

export interface FlattenedCustomElementDeclaration extends CustomElementDeclaration{
    unevaluatedNonStaticPublicFields: ClassField[];
    methods: ClassMethod[];
    path: string;
}