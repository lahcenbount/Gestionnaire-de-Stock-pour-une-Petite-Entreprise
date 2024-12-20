const readline = require('readline');
const { Product } = require("./Product");  // Corriger l'importation de la classe Product
const fs = require('fs');

class Inventory {
  constructor() {
    this.products = [];  // Assurez-vous que le nom de la variable est correct
    this.filePath = 'products.json';  // Chemin du fichier pour stocker les produits
    this.currentId = 1;
    this.loadProducts();  // Chargement des produits à partir du fichier
  }

  loadProducts() { 
    try { 
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.products = JSON.parse(data);  // Charger les produits à partir du fichier
    } 
    catch (err) { 
      console.error('Erreur de chargement des produits :', err); 
      this.products = [];  // Si le fichier n'existe pas ou est vide, initialiser un tableau vide
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
      console.log('Produits sauvegardés avec succès.');
    } catch (err) {
      console.error('Erreur de sauvegarde des produits :', err);
    }
  }

  addProduct(name, description, quantity, price) {
    const id = this.products.length + 1;
    const product = new Product(id, name, description, quantity, price);
    this.products.push(product);
    this.saveProducts();
    console.log('Produit ajouté avec succès.');
  }

  listProducts() {
    this.products.forEach((product, index) => {
      console.log(`\nProduit ${index + 1}:`);
      console.log(`Nom: ${product.name}`);
      console.log(`Description: ${product.description}`);
      console.log(`Quantité: ${product.quantity}`);
      console.log(`Prix unitaire: ${product.price}`);
      console.log(`Prix total: ${product.getTotalPrice()}`);
    });
  }

  updateProduct(id, quantity, price) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      product.quantity = quantity || product.quantity;
      product.price = price || product.price;
      this.saveProducts();
      console.log('Produit mis à jour avec succès.');
    } else {
      console.log('Produit non trouvé.');
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      console.log('Produit supprimé avec succès.');
    } else {
      console.log('Produit non trouvé.');
    }
  }
}

// Configuration de readline pour lire les entrées de la console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Création de l'inventaire
const inventory = new Inventory();

// Fonction d'affichage du menu principal
function showMenu() {
  console.log('\n1. Ajouter un produit');
  console.log('2. Lister les produits');
  console.log('3. Mettre à jour un produit');
  console.log('4. Supprimer un produit');
  console.log('5. Quitter');
  rl.question('Choisissez une option: ', handleMenuChoice);
}

// Fonction pour gérer les choix du menu
function handleMenuChoice(choice) {
  switch (choice) {
    case '1':
      rl.question('Nom du produit: ', (name) => {
        rl.question('Description du produit: ', (description) => {
          rl.question('Quantité: ', (quantity) => {
            rl.question('Prix unitaire: ', (price) => {
              inventory.addProduct(name, description, parseInt(quantity), parseFloat(price));
              showMenu();
            });
          });
        });
      });
      break;

    case '2':
      inventory.listProducts();
      showMenu();
      break;

    case '3':
      rl.question('ID du produit à mettre à jour: ', (id) => {
        rl.question('Nouvelle quantité: ', (quantity) => {
          rl.question('Nouveau prix: ', (price) => {
            inventory.updateProduct(parseInt(id), parseInt(quantity), parseFloat(price));
            showMenu();
          });
        });
      });
      break;

    case '4':
      rl.question('ID du produit à supprimer: ', (id) => {
        inventory.deleteProduct(parseInt(id));
        showMenu();
      });
      break;

    case '5':
      console.log('Au revoir!');
      rl.close();
      break;

    default:
      console.log('Option invalide, veuillez réessayer.');
      showMenu();
      break;
  }
}

// Lancer l'affichage du menu
showMenu();
