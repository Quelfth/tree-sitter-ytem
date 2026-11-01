/**
 * @file Ytem grammar for tree-sitter
 * @author Quelfth <quelfth@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

function list1(rule, separator) {
    return seq(rule, repeat(seq(separator, rule)), optional(separator))
}

function list(rule, separator) {
    return optional(list1(rule, separator))
}

export default grammar({
    name: "ytem",

    conflicts: $ => [
        [$._expr, $.pipeline],
    ],

    rules: {
        source_file: $ => list($._expr, ';'),

        _expr: $ => choice(
            $.string,
            $.number,
            $.file,
            $.variable,
            $.environment_variable,
            $.placeholder,
            $.table,
            $.command,
            $.command_table,
            $.pipeline,
            $.function_call,
            $.method_call,
        ),

        command: $ => seq(
            '[',
            repeat(choice(
                $.word,
                $.single_quotes,
                $.double_quotes,
                $.interpolation,
                $.splat_interpolation,
                $.placeholder,
            )),
            ']',
            optional($.redirects),
        ),

        redirects: $ => seq('(', list($.redirect, ','), ')'),

        redirect: $ => seq(choice($.number, $.name), optional(seq(':', choice($.number, $.name)))),

        pipeline: $ => seq(optional($.table), repeat1(choice($.command, $.command_table))),

        command_table: $ => seq($.command, $.table),

        table: $ => seq('{', list($.table_entry, ','), '}'),

        table_entry: $ => seq(optional(seq(optional(choice($.number, $.name)), ':')), $._expr),

        entry: $ => seq($._expr, '.', choice($.name, $.number, $._any_quotes, $.parenthetical)),

        parenthetical: $ => seq('(', $._expr, ')'),

        function_call: $ => seq($.name, '(', list($._expr, ','), ')'),

        method_call: $ => seq($._expr, $.name, '(', list($._expr, ','), ')'),

        variable: $ => $.name,

        environment_variable: $ => seq('$', $.name),

        string: $ => $._any_quotes,

        file: $ => seq('@', choice(alias(/[\p{XID_Continue}\-+_.\/\\:~]+/, $.path), $._any_quotes)),

        number: $ => /[0-9]+/,

        word: $ => /[^_\s'"\*\{\]][^\s'"\*\{\]]*/,

        name: $ => /\p{XID_Start}[\p{XID_Continue}\-_]*/,

        _any_quotes: $ => choice($.single_quotes, $.double_quotes),

        single_quotes: $ => seq("'", optional(alias(/[^']+/, $.quoted)), "'"),

        double_quotes: $ => seq('"', repeat(choice(alias(/[^"\{\\]+/, $.quoted), $.escape, $.interpolation)), '"'),

        escape: $ => choice('\\"', '\\\\'),

        interpolation: $ => seq('{', $._expr, '}'),

        splat_interpolation: $ => seq('*', '{', $._expr, '}'),

        placeholder: $ => seq('_', optional(alias(/\p{XID_Start}([-_]*[\p{XID_Continue}])*/, $.name)), '_'),
    },
});
