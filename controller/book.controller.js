import Book from '../models/book.model.js';
import cloudinary from '../utils/cloudinary.js';

export const getBook = async(req,res) => {
    try{
        const book = await Book.find()
        res.status(200).json(book);
    }catch(e){
       console.log("Error",error)
       res.status(500).json(error);

    }
}


export const allBook = async (req, res) => {
    try {
        const data = await Book.find({}); 
        res.send({
        status: "ok",
        data: data,
        });
    } catch (error) {
        res.status(500).send({
        status: "error",
        message: error.message,
        });
    }
}


export const addBook = async (req, res) => {
    try {  
      const id = req.body.id;
      const title = req.body.title;
      // const fileName = req.file.filename;
      const name = req.body.name;
      const author = req.body.author;
      const price = req.body.price;
      const image = req.body.image;
      const category = req.body.category;

      console.log(name);
      
    
      console.log("Attempty to upload file: ");
  
      let fileUrl = "";
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        fileUrl = result.secure_url;
      }
  
      console.log("File uploaded: "+ fileUrl);
  
      const result = await Book.create({
        id: id,
        name: name,
        author: author,
        title: title,
        price: price,
        image: image,
        category: category,
        pdf: fileUrl
      });
  
      return res.status(201).json({
        status: "ok",
        message: "Book created successfully",
        id: result._id
      })
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error uploading file");
    }
}



export const deleteBook = async (req, res) => {
    try {
      const { id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
      }
  
  
      const deletedBook = await Book.findByIdAndDelete(id);
  
      if (!deletedBook) {
        return res.status(404).send('Book not found');
      }
  
      res.status(200).send('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).send('Error deleting book');
    }
}