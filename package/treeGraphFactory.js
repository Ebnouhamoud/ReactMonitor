 const { Node } = require('./newNode');
 
 let i = 1;
 // helper function - that accepts the node - Host Root
 module.exports = function (fiber){

    const helper = (fiber, treeGraph) => {
	// 2 different types of react build I saw - 
	//		1 - react element is also leaf in fibertree
	//		2 - has 1 additional child, with type == null
	function null_node(node)
	{
		return ( (node == null) || (
			(node.child == null) &&
				(node.type == null)
		) );
	}
      // check if fiber.child !== null - traverse
	/* if child: create node and enter into child [Dan]*/
      if (fiber.child) {
        // push the new Node to the treeGraph.children array
        // the parent will the tree graph we are currently working with
        // (do the type check for elements that are functions or html elements)
		// again set default to treeGraph.. why?? [Dan]
        let newGraphNode = treeGraph;
		// typeof child.type == object <==> child is null [Dan]
		// condition: fiber child && fiber.ch.ch exists && type != null
		// 			<==> fiber.ch.ch is a leaf (?) [Dan]
		// [Dan] replaced if condition
//        if (
//          typeof fiber.child.type !== 'object'
//          && (fiber.child.child ? typeof fiber.child.child.type !== 'object' : true)
//        ) {
		console.log( fiber.type.name, !null_node(fiber.child) );
		if ( !null_node(fiber.child) )
		{
          newGraphNode = new Node(
            fiber.child.key
            || (fiber.child.type ? fiber.child.type.name : fiber.child.type)
            || fiber.child.type,
            treeGraph, [], fiber.child
          );
          treeGraph.children.push(newGraphNode);
          helper(fiber.child, newGraphNode);
        }
        // recursively invoke the helper on child
//        helper(fiber.child, newGraphNode);
      }
      // check if fiber.sibling !== null - traverse
      if (fiber.sibling)
		{
        let newGraphNode = treeGraph;
//        if (
//          typeof fiber.sibling.type !== 'object'
//          && (fiber.sibling.child ? typeof fiber.sibling.child.type !== 'object' : true)
//        ) {
			if ( !null_node(fiber.sibling) ) {
          // create new GraphNode based on it with parent being a treeGraph.parent
          newGraphNode = new Node(
            fiber.sibling.key
            || (fiber.sibling.type ? fiber.sibling.type.name : fiber.sibling.type)
            || fiber.sibling.type,
            treeGraph.parent, [], fiber.sibling
          );
			// added - the if condition [Dan]
          // push the node on to the treeGraph.parent.children array
          /*if (treeGraph.parent)*/ treeGraph.parent.children.push(newGraphNode);
          helper(fiber.sibling, newGraphNode);
        }
//        helper(fiber.sibling, newGraphNode);
      }
      // name of the element can be found in child.type.name
    };
    // create a treeGraph
    const treeGraph = new Node(fiber.type.name, null, [], fiber); // Represent the top most Element (like App);
    // invoke the helper function
    helper(fiber, treeGraph); // fiber is an App Fiber
    console.log("treeGraphFactory =", treeGraph);
    return treeGraph;
  }
