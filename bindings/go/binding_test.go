package tree_sitter_ytem_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_ytem "github.com/quelfth/tree-sitter-ytem/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ytem.Language())
	if language == nil {
		t.Errorf("Error loading Ytem grammar")
	}
}
