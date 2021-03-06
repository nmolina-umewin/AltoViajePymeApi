"use strict";

module.exports = {
    Administrator                   : require('./administrator'),
    AdministratorAttribute          : require('./administratorAttribute'),
    AdministratorPermission         : require('./administratorPermission'),
    AdministratorToken              : require('./administratorToken'),
    Attribute                       : require('./attribute'),
    AttributeType                   : require('./attributeType'),
    BackofficeTransaction           : require('./backofficeTransaction'),
    BackofficeTransactionType       : require('./backofficeTransactionType'),
    CardType                        : require('./cardType'),
    Company                         : require('./company'),
    CompanyWallet                   : require('./companyWallet'),
    CompanyStatus                   : require('./companyStatus'),
    CompanyAttribute                : require('./companyAttribute'),
    Group                           : require('./group'),
    Permission                      : require('./permission'),
    Person                          : require('./person'),
    PersonCard                      : require('./personCard'),
    PersonGroup                     : require('./personGroup'),
    PersonAttribute                 : require('./personAttribute'),
    Operator                        : require('./operator'),
    PaymentTransaction              : require('./paymentTransaction'),
    PaymentTransactionStatus        : require('./paymentTransactionStatus'),
    Setting                         : require('./setting'),
    User                            : require('./user'),
    UserToken                       : require('./userToken'),
    UserStatus                      : require('./userStatus'),
    UserCompany                     : require('./userCompany'),
    UserPermission                  : require('./userPermission'),
    UserAttribute                   : require('./userAttribute'),
    RechargeTransaction             : require('./rechargeTransaction'),
    RechargeTransactionStatus       : require('./rechargeTransactionStatus'),
    RechargeTransactionSituation    : require('./rechargeTransactionSituation'),
    RechargePaymentOrder            : require('./rechargePaymentOrder'),
    RechargePaymentOrderStatus      : require('./rechargePaymentOrderStatus'),
    RechargePaymentOrderTransaction : require('./rechargePaymentOrderTransaction')
};
