/**
 * Difference between server time and client time, in milliseconds
 */
let serverTimeDifference = 0;

export default {
  
  /**
   * A generic container for RecogitoJS/Annotorious 
   * to store globally available environment info. The 
   * most important piece of information is user auth 
   * info. Example:
   *
   * user: { id, displayName, email, avatarURL }
   * 
   * id ........... the host application user ID (should be a URI, but could be username) REQUIRED
   * displayName .. screen display or nickname OPTIONAL (id is used when empty)
   * email ........ OPTIONAL
   * avatarURL .... OPTIONAL + not supported at the moment
   */

   // Sets a server time to 
   setServerTime: serverNow => {
    const browserNow = Date.now()
    serverTimeDifference = serverNow - browserNow;
   },
   
   getCurrentTimeAdjusted: () =>
     (new Date(Date.now() + serverTimeDifference)).toISOString()

}