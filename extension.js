const vscode = require('vscode');

function activate(context) {
	let disposable = vscode.commands.registerCommand('mdBlockquoteToggler.toggle', function () {
		let editor = vscode.window.activeTextEditor;
	  
		if (editor) {
		  let document = editor.document;
		  let selections = editor.selections;
	  
		  editor.edit(editBuilder => {
			for (let selection of selections) {
			  let startLineNumber = selection.start.line;
			  let endLineNumber = selection.end.line;
			  let startLine = document.lineAt(startLineNumber);
			  let endLine = document.lineAt(endLineNumber);
			  let blockquoteRegex = /^> /;
			  let startPos = startLine.range.start;
			  let endPos = endLine.range.end;
	  
			  if (startLineNumber == endLineNumber && selection.isEmpty) {
				// No selection. Treat as if we've selected the entire line.
				let lineText = startLine.text;
				let lineRange = startLine.range;
				let modifiedText = blockquoteRegex.test(lineText) ?
				  lineText.replace(blockquoteRegex, '') :
				  '> ' + lineText;
	  
				editBuilder.replace(lineRange, modifiedText);
	  
			  } else {
				// Selection present, modify the text for all lines in selection.
				let modifiedText = '';
	  
				for (let i = startLineNumber; i <= endLineNumber; i++) {
				  let line = document.lineAt(i);
				  let lineText = line.text;
				  if (blockquoteRegex.test(lineText)) {
					lineText = lineText.replace(blockquoteRegex, '');
				  } else {
					lineText = '> ' + lineText;
				  }
				  let lineRange = line.range;
				  modifiedText += lineText + (i == endLineNumber ? '' : '\n');
				  startPos = startPos.isBefore(lineRange.start) ? startPos : lineRange.start;
				  endPos = endPos.isAfter(lineRange.end) ? endPos : lineRange.end;
				}
	  
				editBuilder.replace(new vscode.Range(startPos, endPos), modifiedText);
			  }
			}
		  });
		}
	  });

  context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() { }

module.exports = {
  activate,
  deactivate
}
