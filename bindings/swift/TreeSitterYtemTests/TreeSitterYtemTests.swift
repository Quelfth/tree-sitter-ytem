import XCTest
import SwiftTreeSitter
import TreeSitterYtem

final class TreeSitterYtemTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ytem())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Ytem grammar")
    }
}
