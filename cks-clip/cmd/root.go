/*
Copyright © 2023 CodeKickStart dattaraybasab0@gmail.com
*/
package cmd

import (
	"os"

	"github.com/CodeKickstart/cks-clip/cmd/add"
	"github.com/CodeKickstart/cks-clip/cmd/create"

	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "cks-clip",
	Short: "cks-clip is a CLI tool that can generate a recipe given the source directory",
	Long: `

* The purpose of "cks-clip"
	To understand the purpose of "cks-clip", it is important to understand the personas 
	that are involved in the process and how the recipe is used as a tool to facilitate the process.
	The personas include the recipe provider and the recipe consumer.

	The recipe provider is a developer who creates a recipe that can be used to generate a starter project.
	The recipe consumer is a developer who then uses the recipe to quickly generate a starter project. 

	The recipe provider can publish the recipe on the internet.
	The recipe consumer can browse the recipes, select the ones of interest, and execute them to create
	starter projects. These are projects that provide a skeleton of the application that the consumer can then
	customize to create the end application.

* What does cks-clip do?
	"cks-clip" (short for CodeKickStart CLI for Providers) enables a recipe "provider" to create recipes from 
	the source directories of executable applications/libraries that already exist. 


* What is a recipe?
	The recipe is group of instructions that stitch together varoius code fragments from the source directory
	to create a starter project.
	The starter project that is of interest to the consumer may involve a mix of disparate technologies, libraries, languages, etc.
	It may need various components, such as  a web server, a database, and a graphical user interface. 
	The provider will use the recipe to seamlessly package these artifacts in a recipe and the recipe will be to generate 
	a starter project based on options that the consumer selects.

* What is a query context?
	In addition, to illicit consumer preerences, the provisioner also usually creates a collection of questions 
	(collectively called the "query context"). Using the query context, the provider can prompt the consumer to 
	make choices that will influence the code to be generated. 
	The provider uses "cks-clip" to create both the starting "recipe" and the "query context", 
	as these need to work in tandem.

* Can the provider create a recipe without using cks-clip?
	While it is possible to follow the conventions and modify folders and files, it is easier to use "cks-clip" 
	to get a start on the "recipe". 
	Subsequently, by following conventions to modify the source code and add json files, the provider can
	create a fully functional "recipe". 

* What is cks-codegen?
	A service called "cks-codegen" is used to generate the starter code for the consumer. 
	"cks-codegen" in turn uses the query context and "cks-cfg" to prompt the consumer to make choices.
	"cks-codegen" additionally performs error-chacking to ensure that the recipe is syntactically correct.
	The provider would run "cks-codegen" iteratively, correcting mistakes along the way to 
	systematically shape the starter code.

* What does the structure of a recipe look like?
	The recipe is maifested as a directory that contains a set of files and subdirectories. 
	The root directory of the recipe is named "__RECIPE", it is a reserved name. 
	Under the root directory, "__RECIPE", is a set of subdirectories with 
	the following reserved names: "__PHASES", "__CODE", and "__MISC". 

	1. The "__PHASES" subdirctory: 
		It contains json files that decribe the sequence of operations that are to be performed 
		to create the project. Each json file decribes a phase. The execution order of the phases is 
		determined by the requires directive in the json file which specifies other phases (if any) that
		must be executed before the current phase can be executed. This is accomplished by using the
		"requires" directive in the json file. The "requires" directive is a list of phases that must be executed before
		the current phase can be executed. The "requires" directive is optional. 
		A phase file may also contain a "codeblock" directive that specifies reference (a directory name) 
		to a code fragment. This referencesa directory that contains code that is to be inserted 
		into the project. 
		Finally the phase file also contains an "ops" directive that specifies a list of operations that are to be performed.
		The are two types of operations:
		a) Basic operations (copy, remove, execute) do not change the structure of the source code.
		b) Alter operations (transform, recast, pick) change the structure of the source code.

	2. The "__CODE" subdirectory: 
		It contains subdirectories that contain code fragments that are to be inserted into the project.
		The "__CODE" subdirectory contains a subdirectory for each code fragment. 

	3. The "__MISC" subdirectory(optional). 
		It stores directives that are used to control the execution of the recipe.

* The consumer's viewpoint
	The consumer will use the "cks-webkit" to browse the recipes, select the ones of interest, and finally selects one.
	"cks-webkit" prompts the consumer to decide on various aspects of the project such as the project name, the database type, 
	application menu items and a host of other configurations choices. The choices are those that the provider has designed
	a priori to illicit responses from the consumer.
	Based on the choices, the starter project that code that is generated by the recipe can be quite varied.
	After the consumer has made the choices, "cks-webkit" will then use the recipe to generate the starter project.
	The recipe consumer can then add/modify logic to ultimately create a fully functional application.

* What is the process that the provider follows to create a recipe?
	To begin the process, the recipe provider uses the cks-clip to create the starting recipe from a source directory.
	The recipe provider then uses various cks-clip commands to mold code fragments together, by using issuing 
	a pipeline of operations. The provider modifies the recipe until the it is fully functional. 
	The pipeline operations enable providers to:
	- copy, transform, recast, and pick from source fragments
	- execute shell scripts
	- remove certain code sections from the generated code

* Examples of the cks-clip commands below will demonstrate four different cks-clip
commands. The commands are: 
	1. Create Recipe: 
		The "create recipe" command uses the basic operations "remove" and "copy".
		
		In the example below, the provider creates a recipe from the source directory, say "nextjs-app". 
		
			cks-clip create recipe

		The recipe directory, __RECIPE, the context directory, __CONTEXT, and the python script, run.py, 
		with be generated. The parent of the above artifacts will be created as a sibling directory 
		of the source directory (in this example, "nextjs-app") and will be named __CODE_BENCH.
		Instead of the default name, __CODE_BENCH, the provider can specify a different name using the -t option.

		For general help on the cks-clip command, please run the command:
			cks-clip --help or cks-clip -h
		For help on a specific command, please run the command:
			cks-clip <command> --help or cks-clip <command> -h
		The <command> can be one of the following: "create recipe", "add transform", "add recast", or "add pick".

		The create recipe command will:
			- Create a recipe directory named __RECIPE
			- Create a context directory named __CONTEXT under the directory __RECIPE
			- Create a python script named run.py under the directory __RECIPE
			- Create a __QUERY directory under the directory __CONTEXT
			- Create a query token file named core-context.json and place it in the __QUERY directory
			- Create a __PHASES directory under the directory __RECIPE
			- Create a phase file named phase1.json and place it in the __PHASES directory
			- Create a __CODE directory under the directory __RECIPE
			- Create a code block directory named base and place in it the source code from the source directory
			- Create a __MISC directory under the directory __RECIPE and place in it the file names "directive.json"
			
	2 Alter Operators:
		Alter the structure of the input source code. There are 3 alter operators: transform, recast, and pick.
		These commands all have the same form:
		cks-clip add <transform|recast|pick> -a <alter-dir-path> -n <alter-name> -m <movelist>

		The -a option (stands for alter-dir-path) specifies the relative path within source code block that is to be transformed.
		The -n option (stands for alter-name). This name is prepended with '__' and subsequently appended to the alter-dir-path.
		The -m option (stands for movelist) specifies the list of folders and files (delimiter by the ':' character)
		that are to be moved to the store.

		The operation will apply to the first word of the first file encountered for each item of the movelist. 

			2a. add transform: in the example below, the provider adds a transform operation to the recipe.

					cks-clip add transform -a /components -n alter_1 -m about:x.txt

				Note: 
				a) The movelist has 2 items: the folder "about" and the file "x.txt". 
				b) While this operation is really a noop, it is used to illustrate the use of the transform operation. 
				In a real scenario, the provider would use the transform operation to modify the source code.

			2b. add recast: in the example below, the provider adds a recast operation to the recipe.

					cks-clip add recast -a /components -n alter_3 -m contact:layout

				Note: 
				a) The movelist has 2 items: the folder "contact" and the folder "layout". 
				b) While this operation is also a noop, it is used to illustrate the use of the transform operation. 

			2c. add pick: in the example below, the provider adds a pick operation to the recipe.

					cks-clip add pick -a /pages -n alter_4 -m _app.js:_document.js

				Note:
				a) The movelist has 2 items: the file "_app.js" and the file "_document.js". 
				b) While this operation too is a noop, it is used to illustrate the use of the transform operation. 
`,
}

func Execute() {

	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	// cobra.OnInitialize(initConfig)
	rootCmd.CompletionOptions.DisableDefaultCmd = true
	rootCmd.AddCommand(create.CreateCmd)
	rootCmd.AddCommand(add.AddCmd)
}
