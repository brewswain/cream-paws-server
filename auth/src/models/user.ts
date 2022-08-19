import mongoose from "mongoose";
import { PasswordUtil } from "../utils/password-util";

interface UserAttributes {
   email: string;
   password: string;
}

// An interface that states the properties that the user Model uses
interface UserModel extends mongoose.Model<UserDocument> {
   build(attributes: UserAttributes): UserDocument;
}

interface UserDocument extends mongoose.Document {
   email: string;
   password: string;
}

const userSchema = new mongoose.Schema(
   {
      // Please note these types are mongoose specific and are completely unrelated to TS 😔
      email: {
         type: String,
         required: true,
      },
      password: {
         type: String,
         required: true,
      },
   },

   // This is a pretty atypical approach--we normally wouldn't transform our data shape
   // inside a model itself but it works out for our usecase
   {
      toJSON: {
         transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
         },
      },
   }
);

// mongoose middleware pre-save hook
userSchema.pre("save", async function (done) {
   // we need to call done() when we're finished with our function. don't ask.
   // Also, we use the classic function() {} call due to lexical scope--we want to use 'this'
   // to refer to the actual user that we're trying to persist to the db. If we used an arrow
   // function, it would be equal to use user.ts file and not our actual DB document.

   if (this.isModified("password")) {
      const hashed = await PasswordUtil.toHash(this.get("password"));
      this.set("password", hashed);
   }
   done();
});

// Creates a custom function built into our model
// We should now be able to do User.build({})
userSchema.statics.build = (attributes: UserAttributes) => {
   return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
