import axios from "axios";

export default class ApiService{

  static BASE_URL = "http://localhost:8080"

  static getHeader(){
    const token = localStorage.getItem('token');
    return{
      Authorization:`Bearer ${token}`,
      "Content-Type":"application/json"
    };
  }

  static async registerUser(registration,confirmpass){
    const response = await axios.post(`${this.BASE_URL}/auth/register?confirmpass=${confirmpass}`,registration);
    return response.data
  }


  static async loginUser(loginDetails){
    const response = await axios.post(`${this.BASE_URL}/auth/login`,loginDetails);
    return response.data
  }

  static async getAllEvents(page,size){
    const response = await axios.get(`${this.BASE_URL}/event/getall-events/${page}/${size}`)
    return response.data
  }

  static async getUserDetails(userId){
    const response = await axios.get(`${this.BASE_URL}/auth/get-user/${userId}`,{
      headers:this.getHeader()
    })
    return response.data.userDTO
  }

  static async getEachEvent(eventId){
    const response = await axios.get(`${this.BASE_URL}/event/geteach-event/${eventId}`)
    return response.data;
  }

  static async getSearchResult(eventInput,locationInput){
    const response = await axios.get(`${this.BASE_URL}/event/search-event?eventInput=${eventInput}&locationInput=${locationInput}`)
    return response.data
  }

  static async getRecommendation(eventInput,eventId){
    const response = await axios.get(`${this.BASE_URL}/event/recsearch-event?eventInput=${eventInput}&eventId=${eventId}`)
    return response.data
  }

  static async getSomeFeedback(){
    const response = await axios.get(`${this.BASE_URL}/auth/feedback`)
    return response.data
  }

  static async sendContact(contact){
    const response = await axios.post(`${this.BASE_URL}/auth/contact`,contact)
    return response.data
  }

  static async editProfile(edit){
    const response = await axios.post(`${this.BASE_URL}/auth/edit-profile`,edit,{
      headers:this.getHeader()
    })
    return response.data
  }

  static async getHostedEvents(userId){
    const response = await axios.get(`${this.BASE_URL}/event/getHostedEvents/${userId}`,{
      headers:this.getHeader()
    })
    return response.data
  }

  static async otpVerificaton(userId,otp){
    const response = await axios.post(`${this.BASE_URL}/auth/otpverify/${userId}/${otp}`)
    return response.data
  }

  static async hostEvent(userId,event){
    const response = await axios.post(`${this.BASE_URL}/event/host-event/${userId}`,event,{
      headers:this.getHeader()
    })
    return response.data
  }

  static async createOrder(userId,eventId,seatCount){
    const response = await axios.post(`${this.BASE_URL}/payment/create-order/${userId}/${eventId}/${seatCount}`,{
      headers:this.getHeader()
    })
    return response.data
  }

  static async finishOrder(userId,eventId,orderId,paymentId){
    const response = await axios.post(`${this.BASE_URL}/payment/finish-order/${userId}/${eventId}/${orderId}/${paymentId}`,{
      headers:this.getHeader()
    })
    return response.data
  }

  static async cancelOrder(userId,eventId,orderId){
    const response = await axios.post(`${this.BASE_URL}/payment/cancel-order/${userId}/${eventId}/${orderId}`,{
      headers:this.getHeader()
    })
    return response.data
  }

  static async getUserBooking(userId){
    const response = await axios.get(`${this.BASE_URL}/booking/user-bookings/${userId}`,{
      headers:this.getHeader()
    })
    return response.data
  }

  static async getEventTicket(userId,bookId){
    const response = await axios.get(`${this.BASE_URL}/booking/event-ticket/${userId}/${bookId}`,{
      headers:this.getHeader()
    })
    return response.data
  }

  static async getAllBookingByEvent(userId,eventId){
    const response = await axios.get(`${this.BASE_URL}/booking/booked-members/${userId}/${eventId}`,{
      headers:this.getHeader()
    })
    return response.data

  }

  static isAuthenticated(){
    const token = localStorage.getItem('token')
    return !!token
  }


}